import { UNITS } from "../data/units.js";
import { esc } from "../lib/format.js";
import { icon } from "../components/icons.js";
import { WhatsAppButton } from "../components/ui.js";

const directLinks = UNITS.map((u) => `<li class="direct-unit">
  <div><strong>${u.name}</strong> · ${esc(u.district)}<br><span class="status status--inline" data-status data-open="${u.hours.open}" data-close="${u.hours.close}">${u.hours.open}–${u.hours.close}</span></div>
  <div class="direct-unit__actions">
    ${WhatsAppButton({ number: u.whatsappDelivery, text: `Olá! Gostaria de fazer um pedido para entrega na ${u.name} (${u.district}).`, label: "Entrega", size: "sm" })}
    ${WhatsAppButton({ number: u.whatsappPickup, text: `Olá! Gostaria de fazer um pedido para retirada na ${u.name} (${u.district}).`, label: "Retirada", size: "sm", variant: "whatsapp-outline" })}
  </div>
</li>`).join("");

const unitOptions = UNITS.map((u) => `<label class="unit-option">
  <input type="radio" name="unit" value="${u.id}" required>
  <span class="unit-option__box">
    <span class="unit-option__name">${u.name} · ${esc(u.district)}</span>
    <span class="unit-option__meta">${esc(u.street)}</span>
    <span class="status status--inline" data-status data-open="${u.hours.open}" data-close="${u.hours.close}">${u.hours.open}–${u.hours.close}</span>
  </span>
</label>`).join("");

export default {
  path: "/pedido/",
  title: "Fazer pedido",
  description: "Finalize seu pedido do Kombi's Hot Dog: escolha a unidade, entrega ou retirada, revise e envie direto para o WhatsApp da Kombi.",
  scripts: ["pedido.js"],
  body: () => `
<section class="page-hero page-hero--compact" aria-labelledby="pedido-title">
  <div class="container">
    <p class="eyebrow eyebrow--on-dark">Pedido</p>
    <h1 class="display display--md" id="pedido-title">Fazer meu pedido</h1>
    <p class="page-hero__lead">Monte pelo cardápio e envie o pedido pronto para o WhatsApp da unidade. A confirmação, a taxa de entrega e o tempo de preparo são informados pela própria Kombi.</p>
  </div>
</section>

<div class="container section section--tight">
  <div data-checkout-empty>
    <div class="empty-order">
      <div class="empty-order__main">
        <h2 class="h3">Seu pedido está vazio</h2>
        <p>Escolha os hot dogs no cardápio. Você pode adicionar adicionais, retirar ingredientes e deixar observações.</p>
        <a class="btn btn--primary btn--lg" href="/cardapio/">${icon("bag")}<span>Montar pelo cardápio</span></a>
      </div>
      <div class="empty-order__direct">
        <h2 class="h4">Prefere falar direto com a unidade?</h2>
        <ul class="direct-list" role="list">${directLinks}</ul>
      </div>
    </div>
  </div>

  <form class="checkout" data-checkout hidden novalidate>
    <div class="checkout__form">
      <fieldset class="checkout__step">
        <legend><span class="step-num">1</span> Unidade</legend>
        <p class="field-error" data-error="unit" hidden></p>
        <div class="unit-options">${unitOptions}</div>
      </fieldset>

      <fieldset class="checkout__step">
        <legend><span class="step-num">2</span> Entrega ou retirada</legend>
        <div class="segmented" role="radiogroup" aria-label="Modalidade">
          <label><input type="radio" name="mode" value="entrega" checked><span>${icon("truck")} Entrega</span></label>
          <label><input type="radio" name="mode" value="retirada"><span>${icon("store")} Retirada</span></label>
        </div>
        <p class="hint" data-mode-hint></p>
      </fieldset>

      <fieldset class="checkout__step">
        <legend><span class="step-num">3</span> Seus dados</legend>
        <div class="field">
          <label for="c-name">Nome <span aria-hidden="true">*</span></label>
          <input id="c-name" name="name" autocomplete="name" required aria-describedby="e-name">
          <p class="field-error" id="e-name" data-error="name" hidden></p>
        </div>
        <div class="field" data-address-field>
          <label for="c-address">Endereço de entrega <span aria-hidden="true">*</span></label>
          <input id="c-address" name="address" autocomplete="street-address" placeholder="Rua, número, bairro e complemento" aria-describedby="e-address">
          <p class="field-error" id="e-address" data-error="address" hidden></p>
        </div>
        <div class="field">
          <label for="c-payment">Forma de pagamento <span class="optional">(opcional)</span></label>
          <input id="c-payment" name="payment" placeholder="Ex.: Pix, cartão ou dinheiro (troco para…)" aria-describedby="h-payment">
          <p class="hint" id="h-payment">As formas aceitas são confirmadas pela unidade.</p>
        </div>
        <div class="field">
          <label for="c-note">Observações gerais <span class="optional">(opcional)</span></label>
          <textarea id="c-note" name="note" rows="2"></textarea>
        </div>
      </fieldset>
    </div>

    <aside class="checkout__summary" aria-labelledby="summary-title">
      <div class="summary-card">
        <h2 class="h4" id="summary-title">Resumo</h2>
        <div data-summary-lines></div>
        <div class="summary-card__totals" data-summary-totals></div>
        <p class="field-error" data-error="lines" hidden></p>
        <button class="btn btn--primary btn--lg btn--block" type="submit">${icon("check")}<span>Revisar pedido</span></button>
        <a class="text-link summary-card__more" href="/cardapio/">${icon("plus")} Adicionar mais itens</a>
      </div>
    </aside>
  </form>

  <dialog class="review-dialog" id="review-dialog" aria-labelledby="review-title">
    <div class="review-dialog__inner">
      <div class="drawer__head">
        <h2 class="h4" id="review-title">Revise antes de enviar</h2>
        <button class="icon-button" type="button" data-close-dialog aria-label="Fechar revisão">${icon("close")}</button>
      </div>
      <p class="review-dialog__to" data-review-to></p>
      <pre class="review-dialog__message" data-review-message></pre>
      <div class="review-dialog__actions">
        <button class="btn btn--ghost" type="button" data-close-dialog>${icon("edit")}<span>Editar</span></button>
        <a class="btn btn--whatsapp btn--lg" data-send-order target="_blank" rel="noopener">${icon("whatsapp")}<span>Enviar pelo WhatsApp</span></a>
      </div>
      <div class="review-dialog__sent" data-sent hidden>
        <p><strong>Abrimos o WhatsApp da unidade com o seu pedido.</strong> Envie a mensagem por lá. O pedido só está confirmado quando a Kombi responder.</p>
        <button class="btn btn--outline btn--sm" type="button" data-clear-cart>${icon("trash")}<span>Já enviei, limpar carrinho</span></button>
      </div>
    </div>
  </dialog>
</div>`,
};
