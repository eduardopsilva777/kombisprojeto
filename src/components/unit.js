import { UNITS, unitAddress, unitMapQuery } from "../data/units.js";
import { phoneLabel, telHref, esc } from "../lib/format.js";
import { hoursLabel } from "../lib/hours.js";
import { whatsappLink } from "../lib/cart.js";
import { icon } from "./icons.js";

export const mapsUrl = (u) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unitMapQuery(u))}`;
export const wazeUrl = (u) => `https://waze.com/ul?q=${encodeURIComponent(unitMapQuery(u))}&navigate=yes`;

const greeting = (u, mode) =>
  `Olá! Gostaria de fazer um pedido para ${mode === "entrega" ? "entrega" : "retirada"} na ${u.name} (${u.district}).`;

export function UnitCard(u) {
  const samePhone = u.whatsappPickup === u.whatsappDelivery;
  return `<article class="unit-card" data-unit="${u.id}" aria-labelledby="${u.id}-name">
    <header class="unit-card__head">
      <div>
        <h3 class="unit-card__name" id="${u.id}-name">${u.name}</h3>
        <p class="unit-card__district">${esc(u.district)}${u.region ? ` · ${esc(u.region)}` : ""}</p>
      </div>
      <span class="status" data-status data-open="${u.hours.open}" data-close="${u.hours.close}">${icon("clock")}<span>${hoursLabel(u.hours).replace("Todos os dias, das ", "").replace(" às ", "–")}</span></span>
    </header>
    <dl class="unit-card__info">
      <div><dt>${icon("pin")}<span class="sr-only">Endereço</span></dt><dd>${esc(unitAddress(u))}</dd></div>
      <div><dt>${icon("clock")}<span class="sr-only">Horário</span></dt><dd>${hoursLabel(u.hours)}</dd></div>
      <div><dt>${icon("phone")}<span class="sr-only">Telefone delivery</span></dt><dd>Delivery: <a href="${telHref(u.phoneDelivery)}">${phoneLabel(u.phoneDelivery)}</a></dd></div>
      <div><dt>${icon("whatsapp")}<span class="sr-only">WhatsApp</span></dt><dd>${samePhone
        ? `WhatsApp: ${phoneLabel(u.whatsappPickup)}`
        : `Retirada: ${phoneLabel(u.whatsappPickup)}<br>Entrega: ${phoneLabel(u.whatsappDelivery)}`}</dd></div>
    </dl>
    <div class="unit-card__actions">
      <a class="btn btn--whatsapp btn--sm" href="${whatsappLink(u.whatsappDelivery, greeting(u, "entrega"))}" target="_blank" rel="noopener" aria-label="Pedir entrega pelo WhatsApp da ${u.name}">${icon("whatsapp")}<span>Entrega</span></a>
      <a class="btn btn--whatsapp-outline btn--sm" href="${whatsappLink(u.whatsappPickup, greeting(u, "retirada"))}" target="_blank" rel="noopener" aria-label="Pedir para retirar pelo WhatsApp da ${u.name}">${icon("whatsapp")}<span>Retirada</span></a>
      <a class="btn btn--ghost btn--sm" href="${mapsUrl(u)}" target="_blank" rel="noopener" aria-label="Ver ${u.name} no Google Maps">${icon("map")}<span>Mapa</span></a>
      <a class="btn btn--ghost btn--sm" href="${wazeUrl(u)}" target="_blank" rel="noopener" aria-label="Abrir rota até a ${u.name} no Waze">${icon("pin")}<span>Waze</span></a>
    </div>
    <a class="unit-card__build" href="/cardapio/?unidade=${u.id}">Montar pedido nesta unidade ${icon("arrow")}</a>
  </article>`;
}

export const UnitGrid = () => `<div class="unit-grid">${UNITS.map(UnitCard).join("")}</div>`;
