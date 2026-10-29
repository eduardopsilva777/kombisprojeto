// Unidades. Fonte: seção "Localização e Contato" da página inicial do site oficial.
// Telefones no formato E.164 sem "+". Horários em America/Sao_Paulo.
//
// Atenção: para a Kombi's 1 a página inicial informa 19:00–23:59, mas a página /pedido informa 19:00–23:00.
// Mantido o horário da página inicial; confirme com a unidade.

export const UNITS = [
  {
    id: "kombis-1",
    name: "Kombi's 1",
    district: "Jardim Londres",
    street: "Rua Domicio Pacheco e Silva, 1430",
    city: "Campinas",
    whatsappPickup: "5519992911921",
    whatsappDelivery: "5519995023260",
    phoneDelivery: "551937221153",
    hours: { open: "19:00", close: "23:59" },
    hoursNote: "Horário divergente entre páginas do site antigo (23:00 em /pedido).",
  },
  {
    id: "kombis-2",
    name: "Kombi's 2",
    district: "Swift",
    street: "Av. Cap. Samuel Ferreira, 22",
    city: "Campinas",
    whatsappPickup: "5519989982326",
    whatsappDelivery: "5519989982326",
    phoneDelivery: "551932791231",
    hours: { open: "18:30", close: "23:00" },
  },
  {
    id: "kombis-3",
    name: "Kombi's 3",
    district: "Vila Aeroporto",
    street: "Av. Jacaúna, 1495",
    city: "Campinas",
    whatsappPickup: "5519994436607",
    whatsappDelivery: "5519994436607",
    phoneDelivery: "551932249295",
    hours: { open: "18:30", close: "23:00" },
  },
  {
    id: "kombis-4",
    name: "Kombi's 4",
    district: "Jardim Florence",
    region: "Campo Grande",
    street: "Av. John Boyd Dunlop, 8022",
    city: "Campinas",
    whatsappPickup: "5519992959089",
    whatsappDelivery: "5519992959089",
    phoneDelivery: "551933421222",
    hours: { open: "18:30", close: "23:00" },
  },
  {
    id: "kombis-5",
    name: "Kombi's 5",
    district: "Barão Geraldo",
    street: "Rua Agostinho Pattaro, 54",
    city: "Campinas",
    whatsappPickup: "5519992450193",
    whatsappDelivery: "5519992450193",
    phoneDelivery: "551921039296",
    hours: { open: "18:30", close: "23:00" },
  },
];

export const findUnit = (id) => UNITS.find((u) => u.id === id);

export const unitAddress = (u) =>
  `${u.street} · ${u.district}${u.region ? `, ${u.region}` : ""} · ${u.city}`;

export const unitMapQuery = (u) => `${u.street}, ${u.district}, ${u.city} - SP`;
