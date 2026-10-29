// Verifica a saída do build (rode `npm run build` antes; `npm test` já faz isso).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist", import.meta.url));
const pages = readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith(".html")).map((f) => f.replaceAll("\\", "/"));
const read = (f) => readFileSync(join(DIST, f), "utf8");

const resolveInternal = (href) => {
  const path = href.split(/[?#]/)[0];
  if (!path || path === "/") return existsSync(join(DIST, "index.html"));
  return existsSync(join(DIST, path)) || existsSync(join(DIST, path, "index.html"));
};

test("todas as páginas esperadas existem", () => {
  for (const p of ["index.html", "cardapio/index.html", "pedido/index.html", "sobre/index.html", "eventos/index.html", "parceiros/index.html", "menu/index.html", "404.html"]) {
    assert.ok(pages.includes(p), p);
  }
});

for (const page of pages) {
  test(`${page}: metadados, h1 único e links internos válidos`, () => {
    const html = read(page);
    assert.match(html, /<title>[^<]{10,}<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]{30,}">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.kombishotdog\.com\.br\//);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, "um h1");
    assert.doesNotMatch(html, /__BUILD__|undefined|NaN|\[object Object\]/);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) assert.ok(resolveInternal(href), `link quebrado: ${href}`);
    for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) for (const s of set.split(",")) assert.ok(resolveInternal(s.trim().split(" ")[0]), s);
    for (const [, alt] of html.matchAll(/<img [^>]*?alt="([^"]*)"/g)) assert.ok(alt.length > 2, "alt vazio");
    assert.doesNotMatch(html, /href="#"/, "link com destino fictício");
  });
}

test("JSON-LD válido com as 5 unidades", () => {
  const raw = read("index.html").match(/<script type="application\/ld\+json">(.+?)<\/script>/s)[1];
  const data = JSON.parse(raw);
  const units = data["@graph"].filter((n) => n["@type"] === "FastFoodRestaurant");
  assert.equal(units.length, 5);
  assert.ok(!units[0].openingHoursSpecification, "Kombi's 1 sem horário estruturado (divergência)");
  assert.ok(units[1].openingHoursSpecification);
});

test("links de WhatsApp apontam para números de unidades conhecidas", () => {
  const known = new Set(["5519992911921", "5519995023260", "5519989982326", "5519994436607", "5519992959089", "5519992450193"]);
  for (const page of pages) {
    for (const [, n] of read(page).matchAll(/https:\/\/wa\.me\/(\d+)/g)) assert.ok(known.has(n), `${page}: ${n}`);
  }
});

test("sitemap e robots", () => {
  const sm = read("sitemap.xml");
  assert.match(sm, /<loc>https:\/\/www\.kombishotdog\.com\.br\/cardapio\/<\/loc>/);
  assert.doesNotMatch(sm, /404|\/menu\//);
  assert.match(readFileSync(join(DIST, "robots.txt"), "utf8"), /Sitemap:/);
});
