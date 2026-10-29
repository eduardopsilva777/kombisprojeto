import { SITE } from "../data/site.js";
import { Button } from "../components/ui.js";

export const parceiros = {
  path: "/parceiros/",
  title: "Parceiros",
  description: "Seja parceiro do Kombi's Hot Dog e tenha seu espaço reservado no nosso cantinho dos patrocinadores.",
  body: () => `
<section class="page-hero page-hero--compact" aria-labelledby="parceiros-title">
  <div class="container">
    <p class="eyebrow eyebrow--on-dark">Parceiros</p>
    <h1 class="display display--md" id="parceiros-title">Seja nosso parceiro.</h1>
    <p class="page-hero__lead">Tenha seu espaço reservado em nosso cantinho dos patrocinadores!</p>
  </div>
</section>
<section class="section section--tight">
  <div class="container narrow">
    <p class="lead">Quer associar sua marca ao Kombi's Hot Dog? Mande uma mensagem pelas nossas redes sociais e conte sua proposta.</p>
    <div class="cta-row">
      ${Button({ href: SITE.social.instagram, label: "Falar pelo Instagram", iconName: "instagram", attrs: 'target="_blank" rel="noopener"' })}
      ${Button({ href: SITE.social.facebook, label: "Falar pelo Facebook", variant: "outline", iconName: "facebook", attrs: 'target="_blank" rel="noopener"' })}
    </div>
  </div>
</section>`,
};

// /menu ("Menus (novo)" no site antigo) era uma segunda versão do cardápio: redireciona para /cardapio/.
export const menuRedirect = {
  path: "/menu/",
  title: "Cardápio",
  description: "O cardápio do Kombi's Hot Dog mudou de endereço. Você será redirecionado automaticamente.",
  noindex: true,
  canonical: "/cardapio/",
  head: '<meta http-equiv="refresh" content="0; url=/cardapio/">',
  body: () => `<section class="section container"><h1 class="h2">O cardápio mudou de endereço</h1><p><a class="text-link" href="/cardapio/">Ver cardápio</a></p></section>`,
};

export const notFound = {
  path: "/404.html",
  title: "Página não encontrada",
  description: "Página não encontrada no site do Kombi's Hot Dog. Veja o cardápio ou encontre a Kombi mais perto.",
  noindex: true,
  body: () => `
<section class="page-hero" aria-labelledby="nf-title">
  <div class="container narrow">
    <p class="eyebrow eyebrow--on-dark">Erro 404</p>
    <h1 class="display display--md" id="nf-title">Essa Kombi pegou outra rua.</h1>
    <p class="page-hero__lead">A página que você procurou não existe ou mudou de endereço.</p>
    <div class="cta-row">
      ${Button({ href: "/", label: "Voltar ao início" })}
      ${Button({ href: "/cardapio/", label: "Ver cardápio", variant: "outline-light", iconEnd: "arrow" })}
    </div>
  </div>
</section>`,
};
