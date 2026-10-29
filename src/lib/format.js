const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const brl = (v) => BRL.format(v).replace(/ /g, " ");

/** "5519992911921" -> "(19) 99291-1921"; "551937221153" -> "(19) 3722-1153" */
export function phoneLabel(e164) {
  const n = e164.replace(/^55/, "");
  const ddd = n.slice(0, 2), rest = n.slice(2);
  return `(${ddd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
}

export const telHref = (e164) => `tel:+${e164}`;

/** Escapa texto para interpolação em HTML. */
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
