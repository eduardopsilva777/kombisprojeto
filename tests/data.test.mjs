// Confere os dados centralizados contra o que está publicado em www.kombishotdog.com.br (out/2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { UNITS } from "../src/data/units.js";
import { PRODUCTS, CATEGORIES, EXTRAS } from "../src/data/menu.js";
import { IMAGES } from "../src/data/images.js";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OFFICIAL_UNITS = {
  "kombis-1": ["(19) 992911921", "(19) 3722-1153", "(19) 995023260"],
  "kombis-2": ["(19) 989982326", "(19) 3279-1231", "(19) 989982326"],
  "kombis-3": ["(19) 994436607", "(19) 3224-9295", "(19) 994436607"],
  "kombis-4": ["(19) 992959089", "(19) 3342-1222", "(19) 992959089"],
  "kombis-5": ["(19) 992450193", "(19) 2103-9296", "(19) 992450193"],
};
const e164 = (s) => "55" + s.replace(/\D/g, "");

test("cada unidade tem exatamente os contatos publicados (sem mistura)", () => {
  assert.equal(UNITS.length, 5);
  for (const u of UNITS) {
    const [pickup, delivery, waDelivery] = OFFICIAL_UNITS[u.id];
    assert.equal(u.whatsappPickup, e164(pickup), `${u.id} retirada`);
    assert.equal(u.phoneDelivery, e164(delivery), `${u.id} fone delivery`);
    assert.equal(u.whatsappDelivery, e164(waDelivery), `${u.id} entrega`);
  }
});

const OFFICIAL_PRICES = {
  "Kombi Simples": 22.9, "Kombi Tradicional": 24.99, "Kombi Frango": 31.99, "Kombi Catupiry": 31.99, "Kombi Calabresa": 31.99,
  "Kombi Bacon": 31.99, "Kombi Especial": 42.99, "Kombi Philadelphia": 31.99, "Kombi Kids": 20.99, "Kombi Doritos/Philadelphia": 42.99,
  "Kombi Prensado Tradicional": 19.99, "Kombi Prensado Duplo Tradicional": 24.99, "Kombi Prensado Bacon": 29.99, "Kombi Prensado Catupiry": 29.99,
};

test("preços iguais ao cardápio oficial; itens sem preço oficial ficam sem preço", () => {
  for (const p of PRODUCTS) {
    if (p.category === "bebidas") assert.equal(p.price, null, p.name);
    else assert.equal(p.price, OFFICIAL_PRICES[p.name], p.name);
  }
  assert.equal(PRODUCTS.filter((p) => p.price != null).length, Object.keys(OFFICIAL_PRICES).length);
});

test("ids únicos, categorias válidas, imagens existentes", () => {
  assert.equal(new Set(PRODUCTS.map((p) => p.id)).size, PRODUCTS.length);
  const cats = new Set(CATEGORIES.map((c) => c.id));
  for (const p of PRODUCTS) {
    assert.ok(cats.has(p.category), p.id);
    if (p.image) assert.ok(IMAGES[p.image], `${p.id} imagem`);
  }
  assert.equal(EXTRAS.length, 11);
  const root = fileURLToPath(new URL("../src", import.meta.url));
  for (const img of Object.values(IMAGES)) {
    const srcs = typeof img === "string" ? [img] : [img.src, ...(img.srcset || "").split(",").map((s) => s.trim().split(" ")[0]).filter(Boolean)];
    for (const s of srcs) assert.ok(existsSync(root + s), s);
  }
});
