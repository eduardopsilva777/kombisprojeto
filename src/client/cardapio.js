// Cardápio: busca, destaque da categoria visível e unidade pré-selecionada via ?unidade=.
import { $, $$ } from "./ui.js";
import { preferredUnit } from "./store.js";
import { findUnit } from "../data/units.js";
import { CATEGORIES } from "../data/menu.js";

/* Unidade vinda do card "Montar pedido pelo cardápio nesta unidade" */
const unitId = new URLSearchParams(location.search).get("unidade");
const unit = unitId && findUnit(unitId);
if (unit) {
  preferredUnit.set(unit.id);
  const note = $("[data-unit-note]");
  note.innerHTML = `Montando pedido para a <strong>${unit.name} (${unit.district})</strong>. Você confirma a unidade ao finalizar.`;
  note.hidden = false;
}

/* Busca */
const input = $("[data-menu-search]");
const empty = $("[data-menu-empty]");
const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

function applySearch() {
  const q = normalize(input.value);
  let total = 0;
  $$(".menu-section").forEach((section) => {
    let visible = 0;
    $$("[data-search]", section).forEach((el) => {
      const match = !q || normalize(el.dataset.search).includes(q);
      el.hidden = !match;
      if (match) visible++;
    });
    section.hidden = visible === 0;
    total += visible;
  });
  empty.hidden = total > 0;
}
let t;
input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(applySearch, 120); });
$("[data-clear-search]").addEventListener("click", () => { input.value = ""; applySearch(); input.focus(); });

/* Categoria ativa: a última seção cujo topo já passou abaixo da barra de categorias */
const toolbar = $("[data-menu-toolbar]");
const track = $(".category-nav__track");
const links = new Map($$(".chip-link").map((a) => [a.getAttribute("href").slice(1), a]));
const sections = CATEGORIES.map((c) => document.getElementById(c.id)).filter(Boolean);
let active = null;

function setActive(id) {
  if (id === active) return;
  active = id;
  links.forEach((a, key) => {
    if (key === id) {
      a.setAttribute("aria-current", "true");
      // centraliza o chip ativo só dentro do trilho, sem mexer na rolagem da página
      track.scrollTo({ left: a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
    } else a.removeAttribute("aria-current");
  });
}
let ticking = false;
function onScroll() {
  ticking = false;
  const line = toolbar.getBoundingClientRect().bottom + 24;
  const visible = sections.filter((s) => !s.hidden);
  let current = visible[0];
  for (const s of visible) if (s.getBoundingClientRect().top <= line) current = s;
  // no fim da página, a última seção visível é a ativa
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = visible.at(-1);
  if (current) setActive(current.id);
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
input.addEventListener("input", () => requestAnimationFrame(onScroll));
onScroll();
