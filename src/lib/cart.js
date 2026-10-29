// Lógica pura do carrinho e da mensagem de pedido (sem DOM), testada em tests/cart.test.mjs.
import { brl } from "./format.js";

/** Chave estável: o mesmo produto com as mesmas opções vira uma linha só. */
export function lineKey({ productId, extras = [], removed = [], prep = [], note = "" }) {
  return [productId, [...extras].sort().join("+"), [...removed].sort().join("+"), [...prep].sort().join("+"), note.trim()].join("|");
}

export function addLine(lines, line) {
  const qty = Math.max(1, Math.floor(line.qty || 1));
  const item = { extras: [], removed: [], prep: [], note: "", ...line, note: (line.note || "").trim(), qty };
  const key = lineKey(item);
  const existing = lines.find((l) => l.key === key);
  if (existing) return lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
  return [...lines, { ...item, key }];
}

export function setQty(lines, key, qty) {
  return qty > 0 ? lines.map((l) => (l.key === key ? { ...l, qty } : l)) : lines.filter((l) => l.key !== key);
}

export const countItems = (lines) => lines.reduce((n, l) => n + l.qty, 0);

/**
 * Soma apenas o que tem preço divulgado. `pending` indica itens/adicionais cujo valor
 * será informado pela unidade, para a interface nunca apresentar o total como definitivo.
 */
export function totals(lines, findProduct) {
  let subtotal = 0, pending = false;
  for (const l of lines) {
    const p = findProduct(l.productId);
    if (!p) continue;
    if (p.price == null) pending = true;
    else subtotal += Math.round(p.price * 100) * l.qty;
    if (l.extras.length) pending = true;
  }
  return { subtotal: subtotal / 100, pending };
}

/** Remove linhas de produtos que não existem mais no cardápio (ex.: carrinho salvo antigo). */
export const sanitize = (lines, findProduct) =>
  Array.isArray(lines) ? lines.filter((l) => l && typeof l.key === "string" && l.qty > 0 && findProduct(l.productId)) : [];

export function validateCheckout({ lines, unit, mode, name, address }) {
  const errors = {};
  if (!lines.length) errors.lines = "Adicione pelo menos um item ao pedido.";
  if (!unit) errors.unit = "Escolha a unidade.";
  if (mode !== "entrega" && mode !== "retirada") errors.mode = "Escolha entrega ou retirada.";
  if (!name || name.trim().length < 2) errors.name = "Informe seu nome.";
  if (mode === "entrega" && (!address || address.trim().length < 6)) errors.address = "Informe o endereço completo para entrega.";
  return errors;
}

export function describeLine(l) {
  const parts = [];
  if (l.extras.length) parts.push(`+ ${l.extras.join(", ")}`);
  if (l.removed.length) parts.push(`sem ${l.removed.join(", ").toLowerCase()}`);
  if (l.prep.length) parts.push(l.prep.join(", ").toLowerCase());
  if (l.note) parts.push(`obs.: ${l.note}`);
  return parts;
}

export function buildOrderMessage({ lines, unit, mode, name, address, payment, note }, findProduct) {
  const { subtotal, pending } = totals(lines, findProduct);
  const out = [
    `*Pedido pelo site – ${unit.name} (${unit.district})*`,
    `Modalidade: ${mode === "entrega" ? "Entrega (delivery)" : "Retirada na Kombi"}`,
    "",
    "*Itens*",
  ];
  for (const l of lines) {
    const p = findProduct(l.productId);
    const value = p.price == null ? "valor a confirmar" : brl(p.price * l.qty);
    out.push(`• ${l.qty}x ${p.name} — ${value}`);
    for (const d of describeLine(l)) out.push(`   ${d}`);
  }
  out.push("", `*Subtotal:* ${brl(subtotal)}`);
  if (pending) out.push("_Adicionais/bebidas: valor a confirmar_");
  if (mode === "entrega") out.push("_Taxa de entrega: a confirmar_");
  out.push("", `*Nome:* ${name.trim()}`);
  if (mode === "entrega") out.push(`*Endereço:* ${address.trim()}`);
  if (payment && payment.trim()) out.push(`*Pagamento:* ${payment.trim()}`);
  if (note && note.trim()) out.push(`*Observações:* ${note.trim()}`);
  return out.join("\n");
}

export const whatsappLink = (e164, text) => `https://wa.me/${e164}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const orderNumberFor = (unit, mode) => (mode === "entrega" ? unit.whatsappDelivery : unit.whatsappPickup);
