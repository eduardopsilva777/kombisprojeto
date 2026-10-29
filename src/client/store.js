// Estado do carrinho compartilhado entre páginas (localStorage, com fallback em memória).
import { addLine, setQty, sanitize } from "../lib/cart.js";
import { findProduct } from "../data/menu.js";
import { findUnit } from "../data/units.js";

const KEY = "kombis.cart.v1";
const UNIT_KEY = "kombis.unit.v1";
const listeners = new Set();

function read(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado / bloqueado: segue em memória */ }
}

let lines = sanitize(read(KEY, []), findProduct);

function commit(next) {
  lines = next;
  write(KEY, lines);
  listeners.forEach((fn) => fn(lines));
}

export const cart = {
  get lines() { return lines; },
  add(line) { commit(addLine(lines, line)); },
  setQty(key, qty) { commit(setQty(lines, key, qty)); },
  clear() { commit([]); },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};

// Sincroniza entre abas.
window.addEventListener("storage", (e) => {
  if (e.key === KEY) { lines = sanitize(read(KEY, []), findProduct); listeners.forEach((fn) => fn(lines)); }
});

export const preferredUnit = {
  get() { const id = read(UNIT_KEY, null); return findUnit(id) ? id : null; },
  set(id) { if (findUnit(id)) write(UNIT_KEY, id); },
};
