// Servidor estático local para a pasta dist/ (URLs com barra final, 404 personalizado).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = Number(process.env.PORT) || 4173;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml" };

async function resolve(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  let file = join(DIST, safe);
  if (!file.startsWith(DIST)) return null;
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, "index.html");
    await stat(file);
    return file;
  } catch { return null; }
}

createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  // /cardapio -> /cardapio/ (mantém as URLs antigas sem barra funcionando)
  if (!extname(path) && !path.endsWith("/")) {
    if (await resolve(path + "/")) { res.writeHead(301, { Location: path + "/" }); return res.end(); }
  }
  const file = await resolve(path);
  if (!file) {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    return res.end(await readFile(join(DIST, "404.html")));
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`Kombi's Hot Dog em http://localhost:${PORT}`));
