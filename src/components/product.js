import { brl, esc } from "../lib/format.js";
import { IMAGES } from "../data/images.js";
import { CATEGORIES, PRODUCTS, EXTRAS, isCustomizable } from "../data/menu.js";
import { icon } from "./icons.js";
import { img } from "./ui.js";

export const priceLabel = (p) => (p.price == null ? "Consulte" : brl(p.price));

/** layout "row": card horizontal com miniatura (cardápio); padrão: foto grande (destaques). */
export function ProductCard(p, { headingLevel = 3, eager = false, layout = "" } = {}) {
  const h = `h${headingLevel}`;
  const image = p.image ? IMAGES[p.image] : null;
  const row = layout === "row";
  const action = isCustomizable(p) ? "Escolher" : "Adicionar";
  const cls = ["product-card", !image && "product-card--compact", row && "product-card--row"].filter(Boolean).join(" ");
  return `<article class="${cls}" data-product="${p.id}" data-search="${esc(`${p.name} ${(p.ingredients || []).join(" ")}`.toLowerCase())}">
    ${image ? `<div class="product-card__media">
      ${img(image, { sizes: row ? "136px" : "(min-width: 1100px) 360px, (min-width: 640px) 45vw, 92vw", eager, alt: p.photoIsShared ? `${p.name} (foto ilustrativa)` : p.name })}
      ${p.badge && !row ? `<span class="product-card__badge">${p.badge}</span>` : ""}
      ${p.photoIsShared && !row ? `<span class="product-card__note">Foto ilustrativa</span>` : ""}
    </div>` : ""}
    <div class="product-card__body">
      ${p.badge && row ? `<span class="product-card__tag">${p.badge}</span>` : ""}
      <${h} class="product-card__title"><button type="button" class="product-card__open" data-open-product="${p.id}">${esc(p.name)}</button></${h}>
      ${p.summary ? `<p class="product-card__desc">${esc(p.summary)}${p.photoIsShared && row ? ` <span class="product-card__photo-note">Foto ilustrativa.</span>` : ""}</p>` : ""}
      <div class="product-card__foot">
        <span class="price${p.price == null ? " price--pending" : ""}">${priceLabel(p)}</span>
        <button type="button" class="btn btn--primary btn--sm" data-open-product="${p.id}" aria-label="${action} ${esc(p.name)}">${icon("plus")}<span>${action}</span></button>
      </div>
    </div>
  </article>`;
}

export const ProductGrid = (items, { variant = "", ...opts } = {}) =>
  `<div class="product-grid${variant ? ` ${variant.split(" ").map((v) => `product-grid--${v}`).join(" ")}` : ""}">${items.map((p) => ProductCard(p, opts)).join("")}</div>`;

export function CategoryNavigation() {
  return `<nav class="category-nav" aria-label="Categorias do cardápio">
    <div class="category-nav__track">${CATEGORIES.map((c, i) => `<a href="#${c.id}" class="chip-link"${i === 0 ? ' aria-current="true"' : ""}>${c.label}</a>`).join("")}</div>
  </nav>`;
}

export function MenuSections() {
  return CATEGORIES.map((c) => {
    const items = PRODUCTS.filter((p) => p.category === c.id);
    const body = c.id === "adicionais"
      ? `<ul class="extras-list" role="list">${EXTRAS.map((e) => `<li data-search="${esc(e.toLowerCase())}">${esc(e)}</li>`).join("")}</ul>
         <p class="hint">${icon("plus")} Os adicionais são escolhidos ao montar cada hot dog (botão <strong>Escolher</strong>). A opção <strong>Sem pão</strong> também está disponível.</p>`
      : c.id === "bebidas"
        ? `<div class="product-grid product-grid--compact">${items.map((p) => ProductCard(p)).join("")}</div>`
        : `<div class="product-list">${items.map((p) => ProductCard(p, { layout: "row" })).join("")}</div>`;
    return `<section class="menu-section" id="${c.id}" aria-labelledby="${c.id}-title" data-category="${c.id}">
      <header class="menu-section__head"><h2 class="h3" id="${c.id}-title">${c.label}</h2><p>${c.blurb}</p></header>
      ${body}
    </section>`;
  }).join("");
}
