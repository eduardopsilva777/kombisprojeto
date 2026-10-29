// Status de funcionamento calculado no fuso de Campinas, independente do fuso do visitante.

const TZ = "America/Sao_Paulo";
const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

export function minutesInSaoPaulo(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return get("hour") * 60 + get("minute");
}

/** Todas as unidades abrem e fecham no mesmo dia (sem virar a meia-noite). */
export function openStatus(hours, date = new Date()) {
  const now = minutesInSaoPaulo(date);
  const open = toMin(hours.open), close = toMin(hours.close);
  if (now >= open && now <= close) return { open: true, label: `Aberta agora · até ${hours.close}` };
  if (now < open) return { open: false, label: `Fechada · abre hoje às ${hours.open}` };
  return { open: false, label: `Fechada · abre amanhã às ${hours.open}` };
}

export const hoursLabel = (hours) => `Todos os dias, das ${hours.open} às ${hours.close}`;
