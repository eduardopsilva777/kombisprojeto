// Comportamentos globais: header, menu mobile, carrinho, detalhes do produto, status das unidades, animações.
import { cart } from "./store.js";
import { findProduct, EXTRAS, PREP_OPTIONS, removable, isCustomizable } from "../data/menu.js";
import { IMAGES } from "../data/images.js";
import { totals, countItems, describeLine } from "../lib/cart.js";
import { openStatus } from "../lib/hours.js";
import { brl, esc } from "../lib/format.js";
import { icon } from "../components/icons.js";
import { priceLabel } from "../components/product.js";
import { $, $$, openDialog, showToast, QtyControl } from "./ui.js";

document.documentElement.classList.add("js");

/* ---------- Dialogs ---------- */
document.addEventListener("click", (e) => {
  const closer = e.target.closest("[data-close-dialog]");
  if (closer) closer.closest("dialog")?.close();
});
// Clique no backdrop fecha
$$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

/* ---------- Header ---------- */
const header = $("[data-header]");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const menuBtn = $("[data-open-menu]");
const mobileNav = $("#mobile-nav");
menuBtn.addEventListener("click", () => { openDialog(mobileNav); menuBtn.setAttribute("aria-expanded", "true"); });
mobileNav.addEventListener("close", () => menuBtn.setAttribute("aria-expanded", "false"));
$$("a", mobileNav).forEach((a) => a.addEventListener("click", () => mobileNav.close()));

/* ---------- Toast ---------- */
const toast = $("[data-toast]");
toast.addEventListener("click", (e) => { if (e.target.closest("[data-open-cart]")) toast.classList.remove("is-visible"); });

/* ---------- Carrinho ---------- */
const drawer = $("#cart-drawer");
const thumb = (p) => (p.image ? `<img src="${IMAGES[p.image].src}" alt="" width="64" height="64" loading="lazy">` : `<span class="cart-line__ph">${icon("bag")}</span>`);

function renderCart(lines) {
  const n = countItems(lines);
  $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  $("[data-open-cart]").setAttribute("aria-label", n ? `Abrir meu pedido, ${n} ${n === 1 ? "item" : "itens"}` : "Abrir meu pedido");

  const body = $("[data-cart-lines]", drawer), foot = $("[data-cart-foot]", drawer);
  if (!n) {
    body.innerHTML = `<div class="empty-cart">${icon("bag")}<p><strong>Seu pedido está vazio.</strong><br>Escolha um hot dog no cardápio.</p>
      <a class="btn btn--primary" href="/cardapio/">Ver cardápio</a></div>`;
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = lines.map((l) => {
    const p = findProduct(l.productId);
    const opts = describeLine(l);
    return `<div class="cart-line">
      ${thumb(p)}
      <div>
        <p class="cart-line__name">${esc(p.name)}</p>
        ${opts.length ? `<p class="cart-line__opts">${opts.map(esc).join(" · ")}</p>` : ""}
        <div class="cart-line__row">
          ${QtyControl(l)}
          <span class="cart-line__price">${p.price == null ? "A confirmar" : brl(p.price * l.qty)}</span>
        </div>
      </div>
    </div>`;
  }).join("");
  const t = totals(lines, findProduct);
  foot.innerHTML = `<div class="totals">
      <div class="totals__row"><span>Subtotal</span><strong>${brl(t.subtotal)}</strong></div>
      <p class="totals__note">${t.pending ? "Adicionais/bebidas e " : ""}taxa de entrega informados pela unidade.</p>
    </div>
    <a class="btn btn--primary btn--lg btn--block" href="/pedido/">${icon("check")}<span>Finalizar pedido</span></a>
    <button class="btn btn--outline btn--block" type="button" data-close-dialog>Continuar escolhendo</button>`;
}

document.addEventListener("click", (e) => {
  const q = e.target.closest("[data-qty]");
  if (q) {
    const line = cart.lines.find((l) => l.key === q.dataset.qty);
    if (line) cart.setQty(line.key, line.qty + Number(q.dataset.delta));
    return;
  }
  if (e.target.closest("[data-open-cart]")) openDialog(drawer);
});

cart.subscribe(renderCart);
renderCart(cart.lines);

/* ---------- Detalhes / personalização do produto ---------- */
const pDialog = $("#product-dialog");
const pForm = $("[data-product-form]", pDialog);
let current = null;

const chips = (name, items, cls = "") => `<div class="chip-list">${items.map((i) =>
  `<label class="chip-toggle ${cls}"><input type="checkbox" name="${name}" value="${esc(i)}"><span>${esc(i)}</span></label>`).join("")}</div>`;

function openProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  current = { p, qty: 1 };
  const image = p.image ? IMAGES[p.image] : null;
  const custom = isCustomizable(p);
  pForm.innerHTML = `
    <div class="pd__scroll">
      ${image ? `<div class="pd__media"><img src="${image.src}" srcset="${image.srcset}" sizes="560px" alt="${esc(p.photoIsShared ? `${p.name} (foto ilustrativa)` : p.name)}" width="480" height="480">
        <button class="icon-button pd__close" type="button" data-close-dialog aria-label="Fechar">${icon("close")}</button></div>`
      : `<div class="pd__noimg"><button class="icon-button" type="button" data-close-dialog aria-label="Fechar">${icon("close")}</button></div>`}
      <div class="pd__content">
        <div>
          <div class="pd__title"><h2 class="h3" id="pd-title">${esc(p.name)}</h2><span class="price${p.price == null ? " price--pending" : ""}">${priceLabel(p)}</span></div>
          ${p.ingredients ? `<p class="pd__ingredients">${esc(p.ingredients.join(", "))}.</p>` : `<p class="pd__ingredients">Valor informado pela unidade ao confirmar o pedido.</p>`}
        </div>
        ${custom ? `
        <fieldset class="pd__group"><legend>Retirar algum ingrediente? <small>(toque para retirar)</small></legend>${chips("removed", removable(p), "chip-toggle--remove")}</fieldset>
        <fieldset class="pd__group"><legend>Adicionais <small>(valor confirmado pela unidade)</small></legend>${chips("extras", EXTRAS)}</fieldset>
        <fieldset class="pd__group"><legend>Preparo</legend>${chips("prep", PREP_OPTIONS)}</fieldset>` : ""}
        <div class="field"><label for="pd-note">Observação <span class="optional">(opcional)</span></label>
          <textarea id="pd-note" name="note" rows="2" maxlength="140" placeholder="${custom ? "Ex.: bem passado, molho à parte…" : "Ex.: sabor do refrigerante"}"></textarea></div>
      </div>
    </div>
    <div class="pd__foot">
      <div class="qty" role="group" aria-label="Quantidade">
        <button type="button" data-pd-qty="-1" aria-label="Diminuir quantidade">${icon("minus")}</button>
        <output data-pd-qty-out aria-live="polite">1</output>
        <button type="button" data-pd-qty="1" aria-label="Aumentar quantidade">${icon("plus")}</button>
      </div>
      <button class="btn btn--primary btn--lg" type="submit" data-pd-add></button>
    </div>`;
  updateAddLabel();
  openDialog(pDialog);
}

function updateAddLabel() {
  const { p, qty } = current;
  const value = p.price == null ? "" : ` · ${brl(p.price * qty)}`;
  $("[data-pd-add]", pForm).innerHTML = `${icon("plus")}<span>Adicionar${value}</span>`;
  $("[data-pd-qty-out]", pForm).textContent = qty;
}

pForm.addEventListener("click", (e) => {
  const b = e.target.closest("[data-pd-qty]");
  if (!b) return;
  current.qty = Math.max(1, Math.min(30, current.qty + Number(b.dataset.pdQty)));
  updateAddLabel();
});
pForm.addEventListener("change", updateAddLabel);
pForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(pForm);
  cart.add({ productId: current.p.id, qty: current.qty, extras: fd.getAll("extras"), removed: fd.getAll("removed"), prep: fd.getAll("prep"), note: fd.get("note") || "" });
  pDialog.close();
  const btn = $("[data-open-cart]");
  btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  showToast(`${icon("check")}<span>${esc(current.p.name)} no pedido</span><button class="btn btn--primary btn--sm" type="button" data-open-cart>Ver pedido</button>`);
});

document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open-product]");
  if (o) openProduct(o.dataset.openProduct);
});

/* ---------- Status das unidades (horário de Brasília) ---------- */
function updateStatus() {
  $$("[data-status]").forEach((el) => {
    const s = openStatus({ open: el.dataset.open, close: el.dataset.close });
    el.classList.toggle("is-open", s.open);
    const label = el.querySelector("span") || el;
    label.textContent = el.classList.contains("status--inline") ? (s.open ? "Aberta agora" : s.label.replace("Fechada · ", "Fechada, ")) : s.label;
  });
}
updateStatus();
setInterval(updateStatus, 60_000);

/* ---------- Animação de entrada ---------- */
const revealTargets = $$(".section-heading, .product-card, .unit-card, .story__media, .story__copy, .events-cta__grid > *, .facts li");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  revealTargets.forEach((el) => {
    // Só anima o que ainda está fora da tela, para não "piscar" o conteúdo da primeira dobra.
    if (el.getBoundingClientRect().top > innerHeight) { el.setAttribute("data-reveal", ""); io.observe(el); }
  });
}
