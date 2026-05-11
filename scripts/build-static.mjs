import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const files = [
  "index.html",
  "app-preview.js",
  "preview.css",
];

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

for (const file of files) {
  await fs.copyFile(path.join(root, file), path.join(dist, file));
}

console.log(`Built static preview UI into ${dist}`);
