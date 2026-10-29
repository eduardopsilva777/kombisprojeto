import { SITE } from "../data/site.js";
import { UNITS } from "../data/units.js";
import { IMAGES } from "../data/images.js";
import { PRODUCTS } from "../data/menu.js";
import { Button, SectionHeading, img } from "../components/ui.js";
import { ProductGrid } from "../components/product.js";
import { UnitGrid } from "../components/unit.js";
import { icon } from "../components/icons.js";
import { brl } from "../lib/format.js";
import { localBusinessJsonLd } from "./seo.js";

const cheapest = Math.min(...PRODUCTS.filter((p) => p.price != null).map((p) => p.price));
// Seis itens com fotos oficiais distintas.
const FEATURED = ["kombi-especial", "kombi-doritos-philadelphia", "kombi-philadelphia", "kombi-tradicional", "prensado-tradicional", "kombi-kids"]
  .map((id) => PRODUCTS.find((p) => p.id === id));

export default {
  path: "/",
  title: "Kombi's Hot Dog | Food truck de hot dog em Campinas",
  description: `Cachorro quente feito dentro da Kombi desde ${SITE.foundedYear}. 5 unidades em Campinas, abertas todos os dias. Veja o cardápio e faça seu pedido pelo WhatsApp.`,
  jsonLd: localBusinessJsonLd(),
  body: () => `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__stripes" aria-hidden="true"></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow eyebrow--on-dark">Food truck de hot dog · Campinas</p>
      <h1 class="display" id="hero-title">O hot dog da Kombi mais charmosa de <span class="hl">Campinas.</span></h1>
      <p class="hero__lead">Desde ${SITE.foundedYear} servindo cachorro quente caprichado de dentro de Kombis laranja e pretas. São ${UNITS.length} unidades na cidade, abertas todos os dias à noite.</p>
      <div class="hero__actions">
        ${Button({ href: "/pedido/", label: "Fazer meu pedido", iconName: "bag", size: "lg" })}
        ${Button({ href: "/cardapio/", label: "Explorar cardápio", variant: "outline-light", iconEnd: "arrow", size: "lg" })}
      </div>
      <ul class="hero__facts" role="list">
        <li><strong>${UNITS.length}</strong> unidades</li>
        <li><strong>Todos</strong> os dias</li>
        <li><strong>Entrega</strong> ou retirada</li>
      </ul>
    </div>
    <div class="hero__visual">
      <figure class="hero__photo">
        ${img(IMAGES.doritos, { eager: true, sizes: "(min-width: 960px) 520px, 88vw", alt: "Kombi Doritos/Philadelphia servido na Kombi" })}
      </figure>
      <div class="hero__kombi">${img(IMAGES.kombi, { eager: true, sizes: "(min-width: 960px) 340px, 50vw" })}</div>
      <div class="sticker sticker--price" aria-hidden="true"><span>a partir de</span><strong>${brl(cheapest).replace(",", ",<small>")}</small></strong></div>
      <div class="sticker sticker--year" aria-hidden="true"><span>desde</span><strong>${SITE.foundedYear}</strong></div>
    </div>
  </div>
</section>

<section class="brand-band" aria-label="Sobre a marca">
  <ul class="container brand-band__list" role="list">
    <li>Desde ${SITE.foundedYear}</li>
    <li>Feito dentro da Kombi</li>
    <li>${SITE.ingredientBrands.join(" · ")}</li>
    <li>${UNITS.length} unidades em Campinas</li>
  </ul>
</section>

<section class="section" aria-labelledby="destaques-title">
  <div class="container">
    <div class="section-row">
      ${SectionHeading({ eyebrow: "Destaques do cardápio", title: "Escolha seu dogão", id: "destaques-title", lead: "Preços do cardápio oficial. Monte do seu jeito, com adicionais e observações, e envie o pedido direto para a unidade." })}
      ${Button({ href: "/cardapio/", label: "Ver cardápio completo", variant: "outline", iconEnd: "arrow" })}
    </div>
    ${ProductGrid(FEATURED, { variant: "3 rail" })}
  </div>
</section>

<section class="section section--cream story" aria-labelledby="historia-title">
  <div class="container story__grid">
    <div class="story__media">
      <figure class="story__photo">${img(IMAGES.prensado, { sizes: "(min-width: 960px) 460px, 90vw", alt: "Hot dog prensado servido em frente à Kombi" })}</figure>
      <figure class="story__kombi">${img(IMAGES.kombi, { sizes: "300px" })}</figure>
    </div>
    <div class="story__copy">
      <p class="eyebrow">Nossa história</p>
      <h2 class="h2" id="historia-title">Tudo começou em ${SITE.foundedYear}, com uma Kombi.</h2>
      <p class="lead">A paixão por hot dog e por carros antigos deu a ideia: fazer cachorro quente de um jeito diferente, dentro de uma Kombi.</p>
      <p>O visual retrô da Kombi laranja e preta deixa a comida de rua mais atrativa, com todo o charme do carro. Com ingredientes de qualidade e preparo cuidadoso, nasceu uma receita de sabor inconfundível.</p>
      ${Button({ href: "/sobre/", label: "Conheça nossa história", variant: "dark", iconEnd: "arrow" })}
    </div>
  </div>
</section>

<section class="section section--dark" id="unidades" aria-labelledby="unidades-title">
  <div class="container">
    ${SectionHeading({ eyebrow: "Encontre sua Kombi", title: "Tem Kombi perto de você", id: "unidades-title", tone: "dark", lead: "Peça entrega ou retire no balcão. Cada unidade tem seu próprio WhatsApp e telefone. O status mostra quem está aberto agora (horário de Brasília)." })}
    ${UnitGrid()}
  </div>
</section>

<section class="section events-cta" aria-labelledby="eventos-title">
  <div class="container events-cta__grid">
    <div class="events-cta__visual">${img(IMAGES.kombi, { sizes: "(min-width: 960px) 520px, 90vw" })}</div>
    <div>
      <p class="eyebrow">Eventos</p>
      <h2 class="h2" id="eventos-title">Quer um food truck de hot dog no seu evento?</h2>
      <p class="lead">A Kombi's vai até a sua festa, confraternização ou evento. Conte o que você está planejando e a equipe retorna com as informações.</p>
      <div class="events-cta__actions">
        ${Button({ href: "/eventos/", label: "Solicitar orçamento", iconName: "calendar" })}
        <a class="text-link" href="tel:+${SITE.events.phones[0].e164}">${icon("phone")} ${SITE.events.phones[0].label}</a>
      </div>
    </div>
  </div>
</section>`,
};
