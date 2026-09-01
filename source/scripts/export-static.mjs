import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const serverEntrypoint = path.resolve("dist", "server", "index.js");
const vinextModule = await import(pathToFileURL(serverEntrypoint).href);
const routes = ["/", "/about"];

for (const route of routes) {
  const response = await vinextModule.default(new Request(`http://localhost${route}`));

  if (!response.ok) {
    throw new Error(`Failed to prerender ${route}: ${response.status}`);
  }

  const outputPath = route === "/"
    ? path.resolve("dist", "client", "index.html")
    : path.resolve("dist", "client", route.slice(1), "index.html");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, await response.text(), "utf8");
  console.log(`Prerendered ${route} -> ${outputPath}`);
}
