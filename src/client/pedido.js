// Checkout: unidade, modalidade, dados, revisão e envio para o WhatsApp da unidade escolhida.
import { $, $$, openDialog, QtyControl } from "./ui.js";
import { cart, preferredUnit } from "./store.js";
import { findProduct } from "../data/menu.js";
import { findUnit } from "../data/units.js";
import { totals, describeLine, validateCheckout, buildOrderMessage, whatsappLink, orderNumberFor } from "../lib/cart.js";
import { brl, esc, phoneLabel } from "../lib/format.js";

const form = $("[data-checkout]");
const emptyView = $("[data-checkout-empty]");
const review = $("#review-dialog");
const sendLink = $("[data-send-order]", review);

const saved = preferredUnit.get();
if (saved) { const r = form.querySelector(`input[name="unit"][value="${saved}"]`); if (r) r.checked = true; }

function readForm() {
  const fd = new FormData(form);
  return {
    lines: cart.lines,
    unit: findUnit(fd.get("unit")),
    mode: fd.get("mode"),
    name: fd.get("name") || "",
    address: fd.get("address") || "",
    payment: fd.get("payment") || "",
    note: fd.get("note") || "",
  };
}

function renderSummary(lines) {
  const has = lines.length > 0;
  form.hidden = !has;
  emptyView.hidden = has;
  if (!has) { if (review.open) review.close(); return; }
  $("[data-summary-lines]").innerHTML = lines.map((l) => {
    const p = findProduct(l.productId);
    const opts = describeLine(l);
    return `<div class="summary-line">
      <strong>${esc(p.name)}</strong><span>${p.price == null ? "A confirmar" : brl(p.price * l.qty)}</span>
      ${opts.length ? `<span class="summary-line__opts">${opts.map(esc).join(" · ")}</span>` : ""}
      <div class="summary-line__actions">${QtyControl(l)}</div>
    </div>`;
  }).join("");
  const t = totals(lines, findProduct);
  $("[data-summary-totals]").innerHTML = `<div class="totals">
    <div class="totals__row"><span>Subtotal</span><strong>${brl(t.subtotal)}</strong></div>
    <p class="totals__note">${t.pending ? "Adicionais e bebidas têm valor a confirmar. " : ""}${readForm().mode === "entrega" ? "Taxa de entrega informada pela unidade." : "Retirada direto na Kombi."}</p>
  </div>`;
}

function syncMode() {
  const { mode, unit } = readForm();
  const field = $("[data-address-field]");
  field.hidden = mode !== "entrega";
  $("#c-address").required = mode === "entrega";
  $("[data-mode-hint]").textContent = unit
    ? `O pedido será enviado para o WhatsApp de ${mode === "entrega" ? "entrega" : "retirada"} da ${unit.name}: ${phoneLabel(orderNumberFor(unit, mode))}.`
    : "";
  renderSummary(cart.lines);
}

function showErrors(errors) {
  $$("[data-error]", form).forEach((el) => {
    const msg = errors[el.dataset.error];
    el.textContent = msg || "";
    el.hidden = !msg;
  });
  [["name", "#c-name"], ["address", "#c-address"]].forEach(([k, sel]) => $(sel).setAttribute("aria-invalid", errors[k] ? "true" : "false"));
  const first = Object.keys(errors)[0];
  if (first) {
    const target = { unit: 'input[name="unit"]', name: "#c-name", address: "#c-address" }[first];
    (target ? $(target, form) : form).focus();
    if (first === "unit") $(".unit-options").scrollIntoView({ block: "center" });
  }
}

form.addEventListener("change", syncMode);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = readForm();
  const errors = validateCheckout(data);
  showErrors(errors);
  if (Object.keys(errors).length) return;
  preferredUnit.set(data.unit.id);
  const number = orderNumberFor(data.unit, data.mode);
  const message = buildOrderMessage(data, findProduct);
  $("[data-review-to]", review).innerHTML = `Para: <strong>${data.unit.name} (${esc(data.unit.district)})</strong> · WhatsApp ${phoneLabel(number)}`;
  $("[data-review-message]", review).textContent = message;
  sendLink.href = whatsappLink(number, message);
  $("[data-sent]", review).hidden = true;
  openDialog(review);
});

sendLink.addEventListener("click", () => { $("[data-sent]", review).hidden = false; });
$("[data-clear-cart]", review).addEventListener("click", () => { cart.clear(); review.close(); });

cart.subscribe(renderSummary);
syncMode();
