// Dados institucionais. Fonte: www.kombishotdog.com.br (páginas Início, Sobre, Eventos e Parceiros).

export const SITE = {
  name: "Kombi's Hot Dog",
  url: "https://www.kombishotdog.com.br",
  city: "Campinas, SP",
  foundedYear: 2016,
  tagline: "Melhor cachorro quente feito na Kombi mais charmosa de Campinas!",
  social: {
    instagram: "https://www.instagram.com/kombishotdog",
    facebook: "https://www.facebook.com/kombishotdog",
  },
  // Botão geral "Clique e faça seu pedido delivery" do site atual (mesmo número de entrega da Kombi's 1).
  generalWhatsApp: "5519995023260",
  events: {
    // Telefones divulgados na página /eventos.
    phones: [
      { label: "(19) 99637-6572", e164: "5519996376572" },
      { label: "(16) 99758-1308", e164: "5516997581308" },
    ],
    // O formulário atual é um Wix Forms (backend do Wix). Para receber os envios por e-mail fora do Wix,
    // configure aqui um endpoint que aceite POST JSON (ex.: Formspree). Vazio = envio pelo WhatsApp.
    formEndpoint: "",
  },
  // Marcas exibidas no banner oficial "Os melhores ingredientes" do cardápio.
  ingredientBrands: ["Sadia", "Hellmann's", "Philadelphia", "Catupiry"],
};

export const NAV = [
  { href: "/", label: "Início" },
  { href: "/cardapio/", label: "Cardápio" },
  { href: "/sobre/", label: "Nossa História" },
  { href: "/#unidades", label: "Unidades" },
  { href: "/eventos/", label: "Eventos" },
];
