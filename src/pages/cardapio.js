import { SITE } from "../data/site.js";
import { CategoryNavigation, MenuSections } from "../components/product.js";
import { icon } from "../components/icons.js";

export default {
  path: "/cardapio/",
  title: "Cardápio",
  description: "Cardápio completo do Kombi's Hot Dog: hot dogs, prensados, adicionais e bebidas. Monte seu pedido e envie pelo WhatsApp da unidade mais perto.",
  scripts: ["cardapio.js"],
  body: () => `
<section class="page-hero page-hero--compact" aria-labelledby="cardapio-title">
  <div class="container">
    <p class="eyebrow eyebrow--on-dark">Cardápio</p>
    <h1 class="display display--md" id="cardapio-title">Do clássico ao Especial.</h1>
    <p class="page-hero__lead">${SITE.tagline} Ingredientes ${SITE.ingredientBrands.join(", ").replace(/, ([^,]*)$/, " e $1")}.</p>
  </div>
</section>

<div class="menu-toolbar" data-menu-toolbar>
  <div class="container menu-toolbar__inner">
    ${CategoryNavigation()}
    <label class="search">
      <span class="sr-only">Buscar no cardápio</span>
      ${icon("search")}
      <input type="search" placeholder="Buscar: bacon, catupiry…" data-menu-search autocomplete="off">
    </label>
  </div>
</div>

<div class="container menu-body">
  <p class="menu-unit-note" data-unit-note hidden></p>
  ${MenuSections()}
  <div class="empty-state" data-menu-empty hidden>
    <p class="h4">Nada encontrado.</p>
    <p>Tente buscar por outro ingrediente ou <button type="button" class="text-link" data-clear-search>limpe a busca</button>.</p>
  </div>
  <p class="fine-print">Preços conforme cardápio oficial, sujeitos a alteração. Adicionais, bebidas e taxa de entrega têm valores informados pela unidade ao confirmar o pedido.</p>
</div>`,
};
