import { esc } from "../lib/format.js";
import { icon } from "./icons.js";
import { whatsappLink } from "../lib/cart.js";

/** <img> responsivo a partir de uma entrada de IMAGES. */
export function img(image, { sizes = "100vw", eager = false, cls = "", alt } = {}) {
  const usesWidths = /\d+w(,|$)/.test(image.srcset || "");
  return `<img${cls ? ` class="${cls}"` : ""} src="${image.src}"${image.srcset ? ` srcset="${image.srcset}"${usesWidths ? ` sizes="${sizes}"` : ""}` : ""} width="${image.width}" height="${image.height}" alt="${esc(alt ?? image.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>`;
}

export function Button({ href, label, variant = "primary", iconName, iconEnd, attrs = "", size = "" }) {
  const inner = `${iconName ? icon(iconName) : ""}<span>${label}</span>${iconEnd ? icon(iconEnd) : ""}`;
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ""}`;
  return href ? `<a class="${cls}" href="${href}" ${attrs}>${inner}</a>` : `<button class="${cls}" type="button" ${attrs}>${inner}</button>`;
}

export function WhatsAppButton({ number, text, label, size = "", variant = "whatsapp" }) {
  return Button({ href: whatsappLink(number, text), label, variant, iconName: "whatsapp", size, attrs: 'target="_blank" rel="noopener"' });
}

export function SectionHeading({ eyebrow, title, lead = "", id = "", align = "", tone = "" }) {
  return `<header class="section-heading ${align ? `section-heading--${align}` : ""} ${tone ? `section-heading--${tone}` : ""}">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
    <h2 class="h2"${id ? ` id="${id}"` : ""}>${title}</h2>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
  </header>`;
}
