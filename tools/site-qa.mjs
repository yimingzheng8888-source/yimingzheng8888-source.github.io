import { createServer } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "./docx-renderer/node_modules/playwright-core/index.mjs";

const siteRoot = resolve(process.argv[2] || ".");
const outputRoot = resolve(process.argv[3] || join(siteRoot, "qa-output"));
const browserPath = process.env.PROGRAMFILES
  ? join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe")
  : "";

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let target = resolve(siteRoot, `.${normalize(pathname)}`);
    if (!target.startsWith(siteRoot)) throw new Error("Unsafe path");
    const targetStat = await stat(target).catch(() => null);
    if (targetStat?.isDirectory()) target = join(target, "index.html");
    const body = await readFile(target);
    response.writeHead(200, { "content-type": mime[extname(target).toLowerCase()] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

await mkdir(outputRoot, { recursive: true });
await new Promise((resolveReady) => server.listen(0, "127.0.0.1", resolveReady));
const { port } = server.address();
const context = await chromium.launchPersistentContext(join(outputRoot, ".chrome-profile"), {
  executablePath: browserPath,
  headless: true,
});

const results = [];
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  for (const route of ["/", "/about/"]) {
    const page = await context.newPage();
    await page.setViewportSize(viewport);
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < pageHeight; y += Math.max(320, Math.round(viewport.height * 0.7))) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(150);
    await page.screenshot({
      path: join(outputRoot, `${viewport.name}-${route === "/" ? "home" : "about"}.png`),
      fullPage: true,
    });
    const detailSelectors = route === "/"
      ? [["concept", ".project-intro"], ["technical", ".technical-data"], ["layouts", ".deck-section"]]
      : [["profile", ".profile-hero"]];
    for (const [name, selector] of detailSelectors) {
      const detail = page.locator(selector).first();
      if (await detail.count()) {
        await detail.screenshot({ path: join(outputRoot, `${viewport.name}-${name}.png`) });
      }
    }
    const metrics = await page.evaluate(() => ({
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      portrait: (() => {
        const image = document.querySelector(".profile-photo img");
        if (!image) return null;
        const rect = image.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      })(),
      backgrounds: [".project-intro", ".technical-data", ".deck-section"].map((selector) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element).backgroundColor : null;
      }),
    }));
    results.push({ viewport: viewport.name, route, ...metrics });
    await page.close();
  }
}

const interactionPage = await context.newPage();
await interactionPage.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
const deckButtons = interactionPage.locator(".deck-tabs button");
const before = await interactionPage.locator("#active-deck-plan img").getAttribute("src");
await deckButtons.nth(1).click();
const after = await interactionPage.locator("#active-deck-plan img").getAttribute("src");
results.push({ deckTabChangesImage: before !== after });

console.log(JSON.stringify(results, null, 2));
await context.close();
await new Promise((resolveClose) => server.close(resolveClose));
