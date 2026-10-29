// Utilitários de interface compartilhados pelos scripts de página.
import { esc } from "../lib/format.js";
import { icon } from "../components/icons.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];

export function openDialog(d) { if (!d.open) d.showModal(); }

let toastTimer;
export function showToast(html) {
  const toast = $("[data-toast]");
  toast.innerHTML = html;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3800);
}

export function QtyControl(l) {
  return `<div class="qty" role="group" aria-label="Quantidade">
    <button type="button" data-qty="${esc(l.key)}" data-delta="-1" aria-label="${l.qty === 1 ? "Remover item" : "Diminuir quantidade"}">${icon(l.qty === 1 ? "trash" : "minus")}</button>
    <output aria-live="polite">${l.qty}</output>
    <button type="button" data-qty="${esc(l.key)}" data-delta="1" aria-label="Aumentar quantidade">${icon("plus")}</button>
  </div>`;
}
