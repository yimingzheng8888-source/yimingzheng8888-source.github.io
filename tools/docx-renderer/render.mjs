import { createServer } from "node:http";
import { createReadStream, existsSync, readdirSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const [, , inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
  console.error("Usage: pnpm render -- <input.docx> <output-directory>");
  process.exit(1);
}

const inputPath = resolve(inputArg);
const outputDirectory = resolve(outputArg);
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const previewCandidates = [
  join(scriptDirectory, "node_modules", "docx-preview", "dist", "docx-preview.min.js"),
  join(scriptDirectory, "node_modules", "docx-preview", "dist", "docx-preview.js")
];
const previewScript = previewCandidates.find(existsSync);
const pnpmDirectory = join(scriptDirectory, "node_modules", ".pnpm");
const jszipPackage = existsSync(pnpmDirectory)
  ? readdirSync(pnpmDirectory).find((entry) => entry.startsWith("jszip@"))
  : null;
const jszipScript = jszipPackage
  ? join(pnpmDirectory, jszipPackage, "node_modules", "jszip", "dist", "jszip.min.js")
  : null;

if (!existsSync(inputPath)) {
  throw new Error(`DOCX not found: ${inputPath}`);
}

if (!previewScript) {
  throw new Error("docx-preview is not installed. Run pnpm install first.");
}

if (!jszipScript || !existsSync(jszipScript)) {
  throw new Error("JSZip is not installed. Run pnpm install first.");
}

await mkdir(outputDirectory, { recursive: true });

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <style>
    html, body { margin: 0; background: #d9dde0; }
    body { padding: 24px; }
    #document { display: grid; justify-content: center; gap: 24px; }
    .docx-wrapper { padding: 0 !important; background: transparent !important; }
    .docx-wrapper > section.docx { margin: 0 !important; box-shadow: none !important; }
  </style>
</head>
<body>
  <main id="document"></main>
  <script src="/jszip.js"></script>
  <script src="/docx-preview.js"></script>
  <script>
    window.__docxRenderDone = false;
    window.__docxRenderError = null;
    fetch('/input.docx')
      .then((response) => response.arrayBuffer())
      .then((buffer) => window.docx.renderAsync(buffer, document.getElementById('document'), null, {
        breakPages: true,
        ignoreHeight: false,
        ignoreWidth: false,
        inWrapper: true,
        renderChanges: true,
        useBase64URL: true
      }))
      .then(() => { window.__docxRenderDone = true; })
      .catch((error) => {
        window.__docxRenderError = String(error && error.stack ? error.stack : error);
      });
  </script>
</body>
</html>`;

const sendFile = (response, path, contentType) => {
  response.writeHead(200, { "Content-Type": contentType });
  createReadStream(path).pipe(response);
};

const server = createServer((request, response) => {
  if (request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
    return;
  }

  if (request.url === "/docx-preview.js") {
    sendFile(response, previewScript, "text/javascript; charset=utf-8");
    return;
  }

  if (request.url === "/jszip.js") {
    sendFile(response, jszipScript, "text/javascript; charset=utf-8");
    return;
  }

  if (request.url === "/input.docx") {
    sendFile(response, inputPath, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    return;
  }

  response.writeHead(404);
  response.end("Not found");
});

await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
const { port } = server.address();
const browserCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];
const executablePath = browserCandidates.find(existsSync);

if (!executablePath) {
  server.close();
  throw new Error("Chrome or Edge was not found.");
}

const browserProfile = join(outputDirectory, ".chrome-profile");
await mkdir(browserProfile, { recursive: true });
const context = await chromium.launchPersistentContext(browserProfile, {
  executablePath,
  headless: true
});

try {
  const existingPages = context.pages();
  const page = existingPages[0] ?? await context.newPage();
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__docxRenderDone || window.__docxRenderError, null, { timeout: 60_000 });

  const renderError = await page.evaluate(() => window.__docxRenderError);
  if (renderError) {
    throw new Error(renderError);
  }

  const pages = page.locator(".docx-wrapper > section.docx");
  const pageCount = await pages.count();

  if (pageCount === 0) {
    throw new Error("The renderer produced no document pages.");
  }

  for (let index = 0; index < pageCount; index += 1) {
    const pagePath = join(outputDirectory, `page-${index + 1}.png`);
    await pages.nth(index).screenshot({ path: pagePath });
    console.log(pagePath);
  }

  console.log(`Rendered ${pageCount} page(s) from ${basename(inputPath, extname(inputPath))}.`);
}
finally {
  await context.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
