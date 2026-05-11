import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const args = process.argv.slice(2);

function readArg(flag, fallback) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
}

const host = readArg("--host", "127.0.0.1");
const port = Number(readArg("--port", "4173"));
const rootArg = readArg("--root", "dist");
const root = path.resolve(process.cwd(), rootArg);
const indexPath = path.join(root, "index.html");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function getContentType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new url.URL(req.url, `http://${host}:${port}`);
    const requestPath = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    let filePath = requestPath ? path.resolve(root, requestPath) : indexPath;

    if (!filePath.startsWith(root)) {
      filePath = indexPath;
    } else {
      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) filePath = indexPath;
      } catch {
        filePath = indexPath;
      }
    }

    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": getContentType(filePath),
      "Cache-Control": "no-store",
    });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(error));
  }
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}/`);
});
