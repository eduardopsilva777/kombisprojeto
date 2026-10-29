// Cardápio. Fonte: www.kombishotdog.com.br/cardapio (nomes, ingredientes e preços copiados do cardápio oficial).
// price em reais; null = preço não divulgado no site (confirmado pela unidade no WhatsApp).
// photoIsShared: a foto é a mesma usada pelo site oficial para vários itens (exibida como ilustrativa).

export const CATEGORIES = [
  { id: "hot-dogs", label: "Hot Dogs", blurb: "Melhor cachorro quente feito na Kombi mais charmosa de Campinas!" },
  { id: "prensados", label: "Prensados", blurb: "Com salsicha Sadia, fechados e prensados." },
  { id: "adicionais", label: "Adicionais", blurb: "Turbine seu hot dog. Valores confirmados pela unidade." },
  { id: "bebidas", label: "Bebidas", blurb: "Valores confirmados pela unidade." },
];

const BASE = ["Pão", "Salsicha", "Ketchup", "Mostarda", "Milho", "Vinagrete", "Palha", "Purê", "Maionese temperada", "Alho"];
const PRENSADO = ["Pão", "Salsicha Sadia", "Ketchup", "Mostarda", "Vinagrete", "Milho", "Purê", "Maionese temperada", "Batata palha"];

const withExtra = (list, ...extra) => [...list.slice(0, -1), ...extra, list.at(-1)];

export const PRODUCTS = [
  { id: "kombi-simples", category: "hot-dogs", name: "Kombi Simples", price: 22.9, image: "tradicional", photoIsShared: true,
    ingredients: BASE.filter((i) => i !== "Vinagrete") },
  { id: "kombi-tradicional", category: "hot-dogs", name: "Kombi Tradicional", price: 24.99, image: "tradicional", photoIsShared: true, featured: true,
    ingredients: BASE },
  { id: "kombi-frango", category: "hot-dogs", name: "Kombi Frango", price: 31.99, image: "tradicional", photoIsShared: true,
    ingredients: withExtra(BASE, "Frango") },
  { id: "kombi-catupiry", category: "hot-dogs", name: "Kombi Catupiry", price: 31.99, image: "tradicional", photoIsShared: true, featured: true,
    ingredients: withExtra(BASE, "Catupiry") },
  { id: "kombi-calabresa", category: "hot-dogs", name: "Kombi Calabresa", price: 31.99, image: "tradicional", photoIsShared: true,
    ingredients: withExtra(BASE, "Calabresa") },
  { id: "kombi-bacon", category: "hot-dogs", name: "Kombi Bacon", price: 31.99, image: "tradicional", photoIsShared: true, featured: true,
    ingredients: withExtra(BASE, "Bacon") },
  { id: "kombi-especial", category: "hot-dogs", name: "Kombi Especial", price: 42.99, image: "especial", featured: true, badge: "O mais completo",
    ingredients: ["Pão", "2 salsichas", "Ketchup", "Mostarda", "Milho", "Vinagrete", "Frango", "Bacon", "Calabresa", "Palha", "Purê", "Maionese temperada", "Catupiry", "Alho"] },
  { id: "kombi-philadelphia", category: "hot-dogs", name: "Kombi Philadelphia", price: 31.99, image: "philadelphia", featured: true,
    ingredients: withExtra(BASE, "Philadelphia") },
  { id: "kombi-kids", category: "hot-dogs", name: "Kombi Kids", price: 20.99, image: "kids", badge: "Para os pequenos",
    ingredients: ["Pão", "Salsicha", "Ketchup", "Mostarda", "Purê", "Maionese temperada", "Palha"] },
  { id: "kombi-doritos-philadelphia", category: "hot-dogs", name: "Kombi Doritos/Philadelphia", price: 42.99, image: "doritos", featured: true,
    ingredients: withExtra(BASE, "Philadelphia", "Doritos") },

  { id: "prensado-tradicional", category: "prensados", name: "Kombi Prensado Tradicional", price: 19.99, image: "prensado", photoIsShared: true, featured: true,
    ingredients: PRENSADO },
  { id: "prensado-duplo", category: "prensados", name: "Kombi Prensado Duplo Tradicional", price: 24.99, image: "prensado", photoIsShared: true,
    ingredients: ["Pão", "2 salsichas Sadia", ...PRENSADO.slice(2)] },
  { id: "prensado-bacon", category: "prensados", name: "Kombi Prensado Bacon", price: 29.99, image: "prensado", photoIsShared: true,
    ingredients: withExtra(PRENSADO, "Bacon") },
  { id: "prensado-catupiry", category: "prensados", name: "Kombi Prensado Catupiry", price: 29.99, image: "prensado", photoIsShared: true,
    ingredients: withExtra(PRENSADO, "Catupiry") },

  ...["Água", "Refrigerante Lata", "Refrigerante 2 Litros", "Itubaína Long Neck", "Suco Del Valle Lata", "Heineken Lata"].map((name) => ({
    id: `bebida-${slug(name)}`, category: "bebidas", name, price: null,
  })),
];

// Resumo curto exibido nos cards (derivado dos ingredientes oficiais acima).
const SUMMARY = {
  "kombi-simples": "O básico bem feito: salsicha, purê, milho, palha, maionese temperada e alho. Sem vinagrete.",
  "kombi-tradicional": "O clássico da casa, com vinagrete, purê, milho, palha, maionese temperada e alho.",
  "kombi-frango": "O Tradicional completo com frango.",
  "kombi-catupiry": "O Tradicional completo com Catupiry.",
  "kombi-calabresa": "O Tradicional completo com calabresa.",
  "kombi-bacon": "O Tradicional completo com bacon.",
  "kombi-especial": "Duas salsichas, frango, bacon, calabresa e Catupiry, com todos os acompanhamentos.",
  "kombi-philadelphia": "O Tradicional completo com cream cheese Philadelphia.",
  "kombi-kids": "Versão mais simples: salsicha, ketchup, mostarda, purê, maionese temperada e palha.",
  "kombi-doritos-philadelphia": "O Tradicional completo com Philadelphia e Doritos por cima.",
  "prensado-tradicional": "Fechado e prensado, com salsicha Sadia, vinagrete, milho, purê e batata palha.",
  "prensado-duplo": "O Prensado Tradicional com duas salsichas Sadia.",
  "prensado-bacon": "O Prensado Tradicional com bacon.",
  "prensado-catupiry": "O Prensado Tradicional com Catupiry.",
};
for (const p of PRODUCTS) p.summary = SUMMARY[p.id] || "";

// Adicionais listados no cardápio oficial, sem preço divulgado.
export const EXTRAS = ["Catupiry", "Philadelphia", "Doritos", "Bacon", "Frango", "Calabresa", "Salsicha", "Vinagrete", "Milho", "Palha", "Purê"];
// "Pão/Sem Pão" aparece na lista oficial de adicionais; aqui vira a opção de preparo "Sem pão".
export const PREP_OPTIONS = ["Sem pão"];

// Ingredientes que o cliente pode pedir para retirar (pão e salsicha não entram).
export const removable = (p) => (p.ingredients || []).filter((i) => !/^(pão|2 )|salsicha/i.test(i));

export const isCustomizable = (p) => p.category === "hot-dogs" || p.category === "prensados";

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

export function slug(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
