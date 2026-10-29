import { SITE, NAV } from "../data/site.js";
import { UNITS } from "../data/units.js";
import { IMAGES } from "../data/images.js";
import { phoneLabel, telHref, esc } from "../lib/format.js";
import { icon, SPRITE } from "./icons.js";
import { img } from "./ui.js";

const isActive = (href, path) => (href === "/" ? path === "/" : href.startsWith("/#") ? false : path.startsWith(href));

export function Header(path) {
  const links = NAV.map((l) => `<li><a class="nav-link" href="${l.href}"${isActive(l.href, path) ? ' aria-current="page"' : ""}>${l.label}</a></li>`).join("");
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header" data-header>
    <div class="container site-header__inner">
      <a class="site-header__logo" href="/" aria-label="${SITE.name} — página inicial">${img(IMAGES.logo, { eager: true, alt: SITE.name })}</a>
      <nav class="site-nav" aria-label="Principal"><ul>${links}</ul></nav>
      <div class="site-header__actions">
        <button class="cart-button" type="button" data-open-cart aria-label="Abrir meu pedido">
          ${icon("bag")}<span class="cart-button__count" data-cart-count hidden>0</span>
        </button>
        <a class="btn btn--primary btn--sm site-header__cta" href="/pedido/">Fazer pedido</a>
        <button class="menu-button" type="button" data-open-menu aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menu">${icon("menu")}</button>
      </div>
    </div>
  </header>
  ${MobileNavigation(path)}`;
}

export function MobileNavigation(path) {
  return `<dialog class="mobile-nav" id="mobile-nav" aria-label="Menu">
    <div class="mobile-nav__top">
      ${img(IMAGES.logo, { alt: SITE.name, cls: "mobile-nav__logo" })}
      <button class="icon-button" type="button" data-close-dialog aria-label="Fechar menu">${icon("close")}</button>
    </div>
    <nav aria-label="Menu móvel"><ul>
      ${NAV.map((l) => `<li><a href="${l.href}"${isActive(l.href, path) ? ' aria-current="page"' : ""}>${l.label}</a></li>`).join("")}
      <li><a href="/parceiros/"${path.startsWith("/parceiros") ? ' aria-current="page"' : ""}>Parceiros</a></li>
    </ul></nav>
    <a class="btn btn--primary btn--lg btn--block" href="/pedido/">${icon("bag")}<span>Fazer meu pedido</span></a>
  </dialog>`;
}

export function Footer() {
  return `<footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          ${img(IMAGES.logo, { alt: SITE.name, cls: "site-footer__logo" })}
          <p>${SITE.tagline}</p>
          <div class="social">
            <a href="${SITE.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram do Kombi's Hot Dog">${icon("instagram")}</a>
            <a href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook do Kombi's Hot Dog">${icon("facebook")}</a>
          </div>
        </div>
        <nav aria-label="Rodapé">
          <h2 class="site-footer__title">Navegue</h2>
          <ul>
            <li><a href="/cardapio/">Cardápio</a></li>
            <li><a href="/pedido/">Fazer pedido</a></li>
            <li><a href="/sobre/">Nossa história</a></li>
            <li><a href="/#unidades">Unidades</a></li>
            <li><a href="/eventos/">Eventos</a></li>
            <li><a href="/parceiros/">Parceiros</a></li>
          </ul>
        </nav>
        <div class="site-footer__units">
          <h2 class="site-footer__title">Delivery por telefone</h2>
          <ul>${UNITS.map((u) => `<li><span>${u.name} · ${esc(u.district)}</span><a href="${telHref(u.phoneDelivery)}">${phoneLabel(u.phoneDelivery)}</a></li>`).join("")}</ul>
        </div>
      </div>
      <div class="site-footer__legal">
        <p>© <span data-year>${new Date().getFullYear()}</span> ${SITE.name} · ${SITE.city}</p>
        <p>Preços e horários conforme divulgados pelas unidades, sujeitos a alteração. Pedidos feitos pelo site são enviados ao WhatsApp da unidade e confirmados por ela.</p>
      </div>
    </div>
  </footer>`;
}

export function CartDrawer() {
  return `<dialog class="drawer" id="cart-drawer" aria-labelledby="cart-title">
    <div class="drawer__head">
      <h2 id="cart-title" class="h4">Meu pedido</h2>
      <button class="icon-button" type="button" data-close-dialog aria-label="Fechar pedido">${icon("close")}</button>
    </div>
    <div class="drawer__body" data-cart-lines></div>
    <div class="drawer__foot" data-cart-foot></div>
  </dialog>`;
}

export function ProductDetails() {
  return `<dialog class="product-dialog" id="product-dialog" aria-labelledby="pd-title">
    <form method="dialog" class="product-dialog__inner" data-product-form novalidate></form>
  </dialog>`;
}

export function Toast() {
  return `<div class="toast" role="status" aria-live="polite" data-toast></div>`;
}

export function Layout({ path, title, description, body, scripts = [], jsonLd = null, noindex = false, head = "", canonical: canonicalPath = path }) {
  const canonical = `${SITE.url}${canonicalPath}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE.name}`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta name="theme-color" content="#141110">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}${IMAGES.og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="${IMAGES.favicon}">
<link rel="apple-touch-icon" href="${IMAGES.appleTouch}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Archivo:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v=__BUILD__">
${head}
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body>
${SPRITE}
${Header(path)}
<main id="conteudo" tabindex="-1">
${body}
</main>
${Footer()}
${CartDrawer()}
${ProductDetails()}
${Toast()}
<script type="module" src="/assets/js/client/main.js?v=__BUILD__"></script>
${scripts.map((s) => `<script type="module" src="/assets/js/client/${s}?v=__BUILD__"></script>`).join("\n")}
</body>
</html>`;
}
