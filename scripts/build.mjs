// Build estático sem dependências: renderiza as páginas, copia módulos/imagens e gera CSS, sitemap e robots.
import { mkdir, rm, writeFile, readFile, cp, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Layout } from "../src/components/layout.js";
import { SITE } from "../src/data/site.js";
import home from "../src/pages/home.js";
import cardapio from "../src/pages/cardapio.js";
import pedido from "../src/pages/pedido.js";
import sobre from "../src/pages/sobre.js";
import eventos from "../src/pages/eventos.js";
import { parceiros, menuRedirect, notFound } from "../src/pages/misc.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");
const PAGES = [home, cardapio, pedido, sobre, eventos, parceiros, menuRedirect, notFound];
const CSS_ORDER = ["tokens.css", "base.css", "components.css", "pages.css"];

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

// CSS: concatena em um único arquivo e remove comentários/espaços supérfluos.
const css = (await Promise.all(CSS_ORDER.map((f) => readFile(join(SRC, "styles", f), "utf8")))).join("\n")
  .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*\n/g, "\n").replace(/^\s+/gm, "");
await mkdir(join(DIST, "assets/css"), { recursive: true });
await writeFile(join(DIST, "assets/css/site.css"), css);

// Módulos JS: mesma estrutura de pastas do src, para os imports relativos funcionarem no navegador.
for (const dir of ["client", "components", "data", "lib"]) await cp(join(SRC, dir), join(DIST, "assets/js", dir), { recursive: true });
await cp(join(SRC, "assets/img"), join(DIST, "assets/img"), { recursive: true });

// Versão para cache-busting: hash do conteúdo de src.
const hash = createHash("sha1");
for (const f of await readdir(SRC, { recursive: true })) {
  if (/\.(js|css)$/.test(f)) hash.update(await readFile(join(SRC, f)));
}
const version = hash.digest("hex").slice(0, 10);

for (const page of PAGES) {
  const html = Layout({ ...page, body: page.body() }).replaceAll("__BUILD__", version);
  const out = page.path.endsWith(".html") ? join(DIST, page.path) : join(DIST, page.path, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
}

const indexable = PAGES.filter((p) => !p.noindex);
await writeFile(join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${SITE.url}${p.path}</loc></url>`).join("\n")}
</urlset>
`);
await writeFile(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

console.log(`build ok · ${PAGES.length} páginas · v${version} · ${(css.length / 1024).toFixed(1)} KB de CSS`);
