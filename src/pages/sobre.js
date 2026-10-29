import { SITE } from "../data/site.js";
import { UNITS } from "../data/units.js";
import { IMAGES } from "../data/images.js";
import { Button, img } from "../components/ui.js";

export default {
  path: "/sobre/",
  title: "Nossa história",
  description: `Em ${SITE.foundedYear}, a paixão por hot dog e carros antigos virou o Kombi's Hot Dog: cachorro quente feito dentro de uma Kombi laranja e preta em Campinas.`,
  body: () => `
<section class="page-hero" aria-labelledby="sobre-title">
  <div class="container page-hero__split">
    <div>
      <p class="eyebrow eyebrow--on-dark">Nossa história</p>
      <h1 class="display display--md" id="sobre-title">Hot dog, carro antigo e uma ideia em ${SITE.foundedYear}.</h1>
    </div>
    <div class="page-hero__kombi">${img(IMAGES.kombi, { eager: true, sizes: "(min-width: 960px) 480px, 80vw" })}</div>
  </div>
</section>

<article class="section">
  <div class="container story-page">
    <div class="story-page__text prose">
      <p class="lead">Em ${SITE.foundedYear}, a paixão pelo hot dog e por carros antigos nos deu a ideia de inovar a forma de fazer cachorro quente.</p>
      <p>O visual retrô e despojado da Kombi laranja e preta deixa a comida de rua mais atrativa, com todo o charme que esse automóvel possui.</p>
      <p>Com ingredientes de qualidade e preparado com muito amor, desenvolvemos uma receita e um sabor inconfundíveis. Isso tudo só poderia ser feito da forma mais charmosa: dentro de uma Kombi antiga.</p>
      <p>Comer um cachorro quente no Kombi's Hot Dog é garantia de nostalgia. Você vai adorar o nosso jeito de fazer comida de rua: dentro de uma estilosa Kombi!</p>
    </div>
    <figure class="story-page__photo">${img(IMAGES.prensado, { sizes: "(min-width: 960px) 420px, 90vw", alt: "Hot dog prensado servido em frente à Kombi" })}</figure>
  </div>
  <div class="container">
    <ul class="facts" role="list">
      <li><strong>${SITE.foundedYear}</strong><span>o ano em que a ideia nasceu</span></li>
      <li><strong>${UNITS.length}</strong><span>unidades em Campinas</span></li>
      <li><strong>7</strong><span>dias por semana, sempre à noite</span></li>
    </ul>
    <div class="cta-row">
      ${Button({ href: "/cardapio/", label: "Ver o cardápio", iconName: "bag" })}
      ${Button({ href: "/#unidades", label: "Encontrar uma Kombi", variant: "outline", iconName: "pin" })}
    </div>
  </div>
</article>`,
};
