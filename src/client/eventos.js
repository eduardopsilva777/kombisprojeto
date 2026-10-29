// Formulário de eventos. Mesmos campos do formulário original.
// Com SITE.events.formEndpoint configurado, envia por POST; sem endpoint, abre o WhatsApp do contato de eventos.
import { $ } from "./ui.js";
import { SITE } from "../data/site.js";
import { whatsappLink } from "../lib/cart.js";

const form = $("[data-event-form]");
const status = $("[data-event-status]");
const submit = $("[data-event-submit]");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FIELDS = [
  ["#ev-name", (v) => (v.trim().length >= 2 ? "" : "Informe seu nome.")],
  ["#ev-email", (v) => (EMAIL.test(v.trim()) ? "" : "Informe um e-mail válido.")],
  ["#ev-event", (v) => (v.trim().length >= 2 ? "" : "Conte qual é o evento.")],
];

function validate() {
  let firstInvalid = null;
  for (const [sel, check] of FIELDS) {
    const input = $(sel);
    const msg = check(input.value);
    const err = $(`#${input.getAttribute("aria-describedby")}`);
    err.textContent = msg;
    err.hidden = !msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg && !firstInvalid) firstInvalid = input;
  }
  firstInvalid?.focus();
  return !firstInvalid;
}

function setStatus(text, kind) {
  status.textContent = text;
  status.className = `form-status${kind ? ` is-${kind}` : ""}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;
  const data = Object.fromEntries(new FormData(form));

  if (!SITE.events.formEndpoint) {
    const msg = [
      "Olá! Quero informações sobre a Kombi's Hot Dog para um evento.",
      `*Nome:* ${data.nome.trim()}`,
      `*E-mail:* ${data.email.trim()}`,
      `*Evento:* ${data.evento.trim()}`,
      data.detalhes.trim() && `*Detalhes:* ${data.detalhes.trim()}`,
    ].filter(Boolean).join("\n");
    window.open(whatsappLink(SITE.events.phones[0].e164, msg), "_blank", "noopener");
    setStatus("Abrimos o WhatsApp com a sua mensagem. É só enviar por lá.", "ok");
    return;
  }

  submit.classList.add("is-loading");
  submit.setAttribute("aria-busy", "true");
  setStatus("Enviando…");
  try {
    const res = await fetch(SITE.events.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    setStatus("Obrigado! Mensagem enviada.", "ok");
  } catch {
    setStatus(`Não foi possível enviar agora. Tente novamente ou ligue para ${SITE.events.phones[0].label}.`, "error");
  } finally {
    submit.classList.remove("is-loading");
    submit.removeAttribute("aria-busy");
  }
});
