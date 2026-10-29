// Verificação em navegador real (Chrome/Edge headless via DevTools Protocol, sem dependências).
// Uso: npm run build && node scripts/check-browser.mjs [pasta-de-screenshots]
// Checa: erros de console/JS, rolagem horizontal, imagens quebradas, e o fluxo completo de pedido.
import { spawn } from "node:child_process";
import { mkdir, writeFile, mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.argv[2] || join(ROOT, ".checks");
const PORT = 4199, DEBUG = 9339;
const BASE = `http://localhost:${PORT}${(process.env.BASE_PATH || "").replace(/\/+$/, "")}`;
const BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const browserPath = BROWSERS.find((p) => existsSync(p));
if (!browserPath) { console.error("Chrome/Edge não encontrado. Defina CHROME_PATH."); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await mkdir(OUT, { recursive: true });

const server = spawn(process.execPath, [join(ROOT, "scripts/serve.mjs")], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
const profile = await mkdtemp(join(tmpdir(), "kombi-chrome-"));
const chrome = spawn(browserPath, ["--headless=new", `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "--force-color-profile=srgb", "about:blank"], { stdio: "ignore" });

let ws, seq = 0;
const pending = new Map(), events = [];
async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${DEBUG}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
        ws.onmessage = (m) => {
          const msg = JSON.parse(m.data);
          if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); }
          else if (msg.method) events.push(msg);
        };
        return;
      }
    } catch { /* aguardando o navegador subir */ }
    await sleep(200);
  }
  throw new Error("Não foi possível conectar ao navegador");
}
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
async function evaluate(expr) {
  const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`${expr.slice(0, 80)}… → ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
  return r.result.value;
}
async function waitFor(expr, timeout = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) { if (await evaluate(expr).catch(() => false)) return true; await sleep(100); }
  throw new Error(`timeout: ${expr}`);
}
async function goto(path) {
  events.length = 0;
  await send("Page.navigate", { url: BASE + path });
  await waitFor("document.readyState === 'complete' && document.fonts.status === 'loaded'");
  await sleep(250);
}
async function shot(name, full = true) {
  const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: full });
  await writeFile(join(OUT, `${name}.png`), Buffer.from(data, "base64"));
}
const click = (sel) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) throw new Error("não achei ${sel.replace(/"/g, "'")}"); el.click(); return true; })()`);

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); console.log(`${ok ? "✔" : "✖"} ${msg}`); };

try {
  await connect();
  await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable")]);

  const VIEWPORTS = { mobile: [375, 812, true], tablet: [768, 1024, true], desktop: [1440, 900, false] };
  const PAGES = ["/", "/cardapio/", "/pedido/", "/sobre/", "/eventos/", "/parceiros/", "/rota-inexistente"];

  for (const [vp, [width, height, mobile]] of Object.entries(VIEWPORTS)) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
    await send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
    for (const path of PAGES) {
      await goto(path);
      // força o carregamento das imagens lazy para checar se nenhuma está quebrada
      await evaluate(`Promise.all([...document.images].map(i => { i.loading = "eager"; return i.decode().catch(() => {}); }))`);
      // rola a página inteira para disparar as animações de entrada antes da screenshot
      await evaluate(`(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo({ top: y, behavior: "instant" }); await new Promise(r => setTimeout(r, 60)); } scrollTo({ top: 0, behavior: "instant" }); })()`);
      await sleep(700);
      const r = await evaluate(`({
        culprits: [...document.querySelectorAll("body *")].filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && !el.closest("dialog:not([open]), .category-nav__track, .brand-band__list")).slice(0, 6).map(el => el.tagName + "." + [...el.classList].join(".") + " → " + Math.round(el.getBoundingClientRect().right)),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        broken: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src),
        h1: document.querySelectorAll("h1").length,
      })`);
      const errors = events.filter((e) => e.method === "Runtime.exceptionThrown" || (e.method === "Runtime.consoleAPICalled" && e.params.type === "error") || (e.method === "Log.entryAdded" && e.params.entry.level === "error" && !/404/.test(e.params.entry.text + (e.params.entry.url || "")) ));
      const label = `${vp} ${path}`;
      check(r.overflow <= 0, `${label}: sem rolagem horizontal (${r.overflow}px) ${r.overflow > 0 ? r.culprits.join(" | ") : ""}`);
      check(r.broken.length === 0, `${label}: imagens ok ${r.broken.join(", ")}`);
      check(errors.length === 0, `${label}: sem erros no console ${errors.map((e) => JSON.stringify(e.params).slice(0, 200)).join(" | ")}`);
      await shot(`${vp}${path.replace(/\//g, "_") || "_home"}`);
    }
  }

  // ---------- Fluxo de pedido (mobile) ----------
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await goto("/cardapio/?unidade=kombis-1");
  await evaluate("localStorage.clear()");
  await goto("/cardapio/?unidade=kombis-1");
  check(await evaluate(`!document.querySelector("[data-unit-note]").hidden`), "cardápio mostra a unidade escolhida no card da unidade");

  await evaluate(`(() => { const i = document.querySelector("[data-menu-search]"); i.value = "doritos"; i.dispatchEvent(new Event("input")); })()`);
  await sleep(300);
  const visible = await evaluate(`[...document.querySelectorAll(".product-card")].filter(c => !c.hidden && !c.closest("[hidden]")).map(c => c.dataset.product)`);
  check(visible.length === 1 && visible[0] === "kombi-doritos-philadelphia", `busca "doritos" filtra (${visible})`);
  await evaluate(`(() => { const i = document.querySelector("[data-menu-search]"); i.value = "xyz123"; i.dispatchEvent(new Event("input")); })()`);
  await sleep(300);
  check(await evaluate(`!document.querySelector("[data-menu-empty]").hidden`), "busca sem resultado mostra estado vazio");
  await click("[data-clear-search]");
  await evaluate(`scrollTo({ top: document.getElementById("prensados").getBoundingClientRect().top + scrollY - 140, behavior: "instant" })`);
  await sleep(300);
  check(await evaluate(`document.querySelector('.chip-link[aria-current="true"]')?.getAttribute("href") === "#prensados"`), "categoria ativa acompanha a rolagem (Prensados)");
  await evaluate(`scrollTo({ top: 0, behavior: "instant" })`);
  await sleep(200);

  await click('[data-product="kombi-especial"] .btn');
  await waitFor(`document.querySelector("#product-dialog").open`);
  await click('#product-dialog input[name="extras"][value="Bacon"]');
  await click('#product-dialog input[name="removed"][value="Milho"]');
  await click('#product-dialog [data-pd-qty="1"]');
  check(/R\$\s?85,98$/.test(await evaluate(`document.querySelector("[data-pd-add]").textContent`)), "botão do produto mostra 2 × R$ 42,99");
  await shot("flow-1-produto", false);
  await click("[data-pd-add]");
  await sleep(300);
  check(await evaluate(`document.querySelector("[data-cart-count]").textContent === "2"`), "contador do carrinho = 2");
  check(await evaluate(`document.querySelector("[data-toast]").classList.contains("is-visible")`), "toast de confirmação aparece");

  await click('[data-product="bebida-agua"] .btn');
  await waitFor(`document.querySelector("#product-dialog").open`);
  await click("[data-pd-add]");
  await sleep(200);
  await click(".cart-button");
  await waitFor(`document.querySelector("#cart-drawer").open`);
  await sleep(300);
  await shot("flow-2-carrinho", false);
  check(/85,98/.test(await evaluate(`document.querySelector("[data-cart-foot]").textContent`)), "subtotal do carrinho R$ 85,98 (água a confirmar)");

  await goto("/pedido/");
  check(await evaluate(`!document.querySelector("[data-checkout]").hidden`), "checkout aparece com itens no carrinho");
  check(await evaluate(`document.querySelector('input[name="unit"]:checked')?.value === "kombis-1"`), "unidade pré-selecionada a partir do cardápio");
  await click('[data-checkout] button[type="submit"]');
  await sleep(200);
  check(await evaluate(`!document.querySelector('[data-error="name"]').hidden && !document.querySelector('[data-error="address"]').hidden`), "validação mostra erros de nome e endereço");
  check(await evaluate(`!document.querySelector("#review-dialog").open`), "revisão não abre com dados inválidos");
  await shot("flow-3-validacao");

  await evaluate(`(() => {
    const set = (sel, v) => { const el = document.querySelector(sel); el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); };
    set("#c-name", "Cliente Teste"); set("#c-address", "Rua Exemplo, 100 - Jardim Londres"); set("#c-payment", "Pix");
  })()`);
  await click('[data-checkout] button[type="submit"]');
  await waitFor(`document.querySelector("#review-dialog").open`);
  await sleep(300);
  await shot("flow-4-revisao", false);
  let href = await evaluate(`document.querySelector("[data-send-order]").href`);
  let msg = decodeURIComponent(new URL(href).searchParams.get("text"));
  check(href.startsWith("https://wa.me/5519995023260?text="), `entrega Kombi's 1 → WhatsApp de entrega (${href.slice(0, 40)})`);
  check(msg.includes("2x Kombi Especial — R$ 85,98") && msg.includes("+ Bacon") && msg.includes("sem milho") && msg.includes("1x Água — valor a confirmar") && msg.includes("Rua Exemplo, 100"), "mensagem contém itens, opções e endereço");
  await click('#review-dialog [data-close-dialog]');

  await click('input[name="mode"][value="retirada"]');
  await sleep(100);
  check(await evaluate(`document.querySelector("[data-address-field]").hidden`), "endereço some na retirada");
  await click('[data-checkout] button[type="submit"]');
  await waitFor(`document.querySelector("#review-dialog").open`);
  href = await evaluate(`document.querySelector("[data-send-order]").href`);
  check(href.startsWith("https://wa.me/5519992911921?text="), "retirada Kombi's 1 → WhatsApp de retirada");
  msg = decodeURIComponent(new URL(href).searchParams.get("text"));
  check(!msg.includes("Endereço") && msg.includes("Retirada na Kombi"), "mensagem de retirada sem endereço");
  await click('#review-dialog [data-close-dialog]');

  await click('input[name="unit"][value="kombis-4"]');
  await click('[data-checkout] button[type="submit"]');
  await waitFor(`document.querySelector("#review-dialog").open`);
  check((await evaluate(`document.querySelector("[data-send-order]").href`)).startsWith("https://wa.me/5519992959089?"), "Kombi's 4 → número da Kombi's 4");
  // Simula o clique de envio sem abrir uma nova aba
  await evaluate(`(() => { const a = document.querySelector("[data-send-order]"); a.addEventListener("click", e => e.preventDefault(), { once: true }); a.click(); })()`);
  check(await evaluate(`!document.querySelector("[data-sent]").hidden`), "após envio, aviso de que a confirmação é da unidade");
  await click("[data-clear-cart]");
  await sleep(200);
  check(await evaluate(`!document.querySelector("[data-checkout-empty]").hidden && JSON.parse(localStorage.getItem("kombis.cart.v1")).length === 0`), "limpar carrinho volta ao estado vazio");

  // ---------- Menu mobile ----------
  await goto("/");
  await click("[data-open-menu]");
  await waitFor(`document.querySelector("#mobile-nav").open`);
  await sleep(400);
  check(await evaluate(`document.querySelector("[data-open-menu]").getAttribute("aria-expanded") === "true"`), "menu mobile abre com aria-expanded");
  await shot("flow-5-menu-mobile", false);
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await sleep(200);
  check(await evaluate(`!document.querySelector("#mobile-nav").open`), "Esc fecha o menu mobile");

  // ---------- Eventos ----------
  await goto("/eventos/");
  await click("[data-event-submit]");
  check(await evaluate(`document.querySelectorAll('.card-form [aria-invalid="true"]').length === 3`), "eventos: 3 campos obrigatórios validados");
  await evaluate(`(() => {
    window.__opened = null; window.open = (u) => { window.__opened = u; return null; };
    const f = document.querySelector("[data-event-form]");
    f.nome.value = "Maria"; f.email.value = "maria@exemplo.com"; f.evento.value = "Aniversário"; f.detalhes.value = "80 pessoas";
  })()`);
  await click("[data-event-submit]");
  const opened = await evaluate("window.__opened");
  check(opened?.startsWith("https://wa.me/5519996376572?text=") && decodeURIComponent(opened).includes("maria@exemplo.com"), "eventos: abre WhatsApp do contato de eventos com os dados");
} catch (e) {
  failures.push(String(e.stack || e));
  console.error(e);
} finally {
  ws?.close();
  chrome.kill();
  server.kill();
}

console.log(`\n${failures.length ? `✖ ${failures.length} falha(s)` : "✔ tudo ok"} · screenshots em ${OUT}`);
process.exit(failures.length ? 1 : 0);
