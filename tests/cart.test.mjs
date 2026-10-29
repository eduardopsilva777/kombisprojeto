import { test } from "node:test";
import assert from "node:assert/strict";
import { addLine, setQty, totals, countItems, validateCheckout, buildOrderMessage, whatsappLink, orderNumberFor, sanitize } from "../src/lib/cart.js";
import { findProduct } from "../src/data/menu.js";
import { findUnit } from "../src/data/units.js";

test("mesmo produto com mesmas opções soma na mesma linha", () => {
  let lines = addLine([], { productId: "kombi-bacon", qty: 1 });
  lines = addLine(lines, { productId: "kombi-bacon", qty: 2 });
  assert.equal(lines.length, 1);
  assert.equal(lines[0].qty, 3);
});

test("opções diferentes geram linhas diferentes (ordem das opções não importa)", () => {
  let lines = addLine([], { productId: "kombi-bacon", extras: ["Catupiry", "Milho"] });
  lines = addLine(lines, { productId: "kombi-bacon", extras: ["Milho", "Catupiry"] });
  lines = addLine(lines, { productId: "kombi-bacon", removed: ["Vinagrete"] });
  assert.equal(lines.length, 2);
  assert.equal(lines[0].qty, 2);
});

test("setQty altera e remove com zero", () => {
  let lines = addLine([], { productId: "kombi-simples" });
  lines = setQty(lines, lines[0].key, 4);
  assert.equal(countItems(lines), 4);
  assert.deepEqual(setQty(lines, lines[0].key, 0), []);
});

test("subtotal soma em centavos sem erro de ponto flutuante", () => {
  let lines = addLine([], { productId: "kombi-tradicional", qty: 3 }); // 3 x 24,99
  lines = addLine(lines, { productId: "prensado-tradicional", qty: 1 }); // 19,99
  lines = addLine(lines, { productId: "kombi-simples", qty: 1 }); // 22,90
  const t = totals(lines, findProduct);
  assert.equal(t.subtotal, 117.86);
  assert.equal(t.pending, false);
});

test("bebidas e adicionais marcam valores pendentes sem somar valores inventados", () => {
  let lines = addLine([], { productId: "kombi-bacon", extras: ["Catupiry"] });
  assert.deepEqual(totals(lines, findProduct), { subtotal: 31.99, pending: true });
  lines = addLine([], { productId: "bebida-agua", qty: 2 });
  assert.deepEqual(totals(lines, findProduct), { subtotal: 0, pending: true });
});

test("validação exige endereço só na entrega", () => {
  const lines = addLine([], { productId: "kombi-bacon" });
  const unit = findUnit("kombis-2");
  assert.ok(validateCheckout({ lines, unit, mode: "entrega", name: "Ana", address: "" }).address);
  assert.deepEqual(validateCheckout({ lines, unit, mode: "retirada", name: "Ana", address: "" }), {});
  const e = validateCheckout({ lines: [], unit: null, mode: "x", name: "" });
  assert.deepEqual(Object.keys(e).sort(), ["lines", "mode", "name", "unit"]);
});

test("Kombi's 1 usa números diferentes para entrega e retirada", () => {
  const u = findUnit("kombis-1");
  assert.equal(orderNumberFor(u, "entrega"), "5519995023260");
  assert.equal(orderNumberFor(u, "retirada"), "5519992911921");
});

test("mensagem do pedido traz unidade, itens, opções, total e dados", () => {
  let lines = addLine([], { productId: "kombi-especial", qty: 2, extras: ["Doritos"], removed: ["Milho"], prep: ["Sem pão"], note: "bem quente" });
  lines = addLine(lines, { productId: "bebida-heineken-lata" });
  const msg = buildOrderMessage({ lines, unit: findUnit("kombis-5"), mode: "entrega", name: " Ana ", address: "Rua X, 10", payment: "Pix", note: "" }, findProduct);
  assert.match(msg, /Kombi's 5 \(Barão Geraldo\)/);
  assert.match(msg, /2x Kombi Especial — R\$ 85,98/);
  assert.match(msg, /\+ Doritos/);
  assert.match(msg, /sem milho/);
  assert.match(msg, /sem pão/);
  assert.match(msg, /obs\.: bem quente/);
  assert.match(msg, /1x Heineken Lata — valor a confirmar/);
  assert.match(msg, /\*Subtotal:\* R\$ 85,98/);
  assert.match(msg, /Taxa de entrega: a confirmar/);
  assert.match(msg, /\*Nome:\* Ana\n/);
  assert.match(msg, /\*Endereço:\* Rua X, 10/);
  assert.doesNotMatch(msg, /Observações/);
});

test("link do WhatsApp codifica a mensagem para URL", () => {
  const url = whatsappLink("5519992450193", "Olá & tchau\n#1");
  assert.equal(url, "https://wa.me/5519992450193?text=Ol%C3%A1%20%26%20tchau%0A%231");
  assert.equal(decodeURIComponent(new URL(url).searchParams.get("text")), "Olá & tchau\n#1");
});

test("sanitize descarta linhas inválidas ou de produtos removidos", () => {
  const ok = addLine([], { productId: "kombi-bacon" });
  assert.equal(sanitize([...ok, { key: "x", productId: "nao-existe", qty: 1 }, null, { key: 1 }], findProduct).length, 1);
  assert.deepEqual(sanitize("lixo", findProduct), []);
});
