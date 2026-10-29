// Ícones em linha única (stroke) desenhados para o projeto + marcas (WhatsApp, Instagram, Facebook).
const STROKE = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

const PATHS = {
  bag: `<path ${STROKE} d="M5 8h14l-1 13H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2"/>`,
  menu: `<path ${STROKE} d="M4 7h16M4 12h16M4 17h16"/>`,
  close: `<path ${STROKE} d="M6 6l12 12M18 6 6 18"/>`,
  plus: `<path ${STROKE} d="M12 5v14M5 12h14"/>`,
  minus: `<path ${STROKE} d="M5 12h14"/>`,
  arrow: `<path ${STROKE} d="M5 12h14m-6-6 6 6-6 6"/>`,
  pin: `<path ${STROKE} d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle ${STROKE} cx="12" cy="9" r="2.5"/>`,
  phone: `<path ${STROKE} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>`,
  clock: `<circle ${STROKE} cx="12" cy="12" r="9"/><path ${STROKE} d="M12 7v5l3 2"/>`,
  search: `<circle ${STROKE} cx="11" cy="11" r="7"/><path ${STROKE} d="m20 20-3.5-3.5"/>`,
  check: `<path ${STROKE} d="m5 12 5 5 9-10"/>`,
  trash: `<path ${STROKE} d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>`,
  truck: `<path ${STROKE} d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle ${STROKE} cx="7" cy="17.5" r="1.8"/><circle ${STROKE} cx="17" cy="17.5" r="1.8"/>`,
  store: `<path ${STROKE} d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M10 20v-5h4v5"/>`,
  map: `<path ${STROKE} d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14"/>`,
  calendar: `<rect ${STROKE} x="3" y="5" width="18" height="16" rx="2"/><path ${STROKE} d="M3 10h18M8 3v4M16 3v4"/>`,
  edit: `<path ${STROKE} d="M4 20h4L19 9l-4-4L4 16v4Z"/>`,
  whatsapp: `<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/>`,
  instagram: `<rect ${STROKE} x="3" y="3" width="18" height="18" rx="5"/><circle ${STROKE} cx="12" cy="12" r="4"/><circle fill="currentColor" cx="17.5" cy="6.5" r="1.2"/>`,
  facebook: `<path fill="currentColor" d="M14 8V6.2c0-.8.2-1.2 1.4-1.2H17V2h-2.6C11.3 2 10 3.5 10 6v2H8v3h2v11h4V11h2.6L17 8h-3Z"/>`,
};

export const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(PATHS)
  .map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${d}</symbol>`)
  .join("")}</svg>`;

export const icon = (name, cls = "") => `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
