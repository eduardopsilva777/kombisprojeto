import { SITE } from "../data/site.js";
import { IMAGES } from "../data/images.js";
import { img } from "../components/ui.js";
import { icon } from "../components/icons.js";

// Campos preservados do formulário original (Wix Forms): Nome*, Email*, Evento*, Detalhes do evento.
export default {
  path: "/eventos/",
  title: "Food truck de hot dog para eventos",
  description: "Leve a Kombi's Hot Dog para o seu evento em Campinas e região. Preencha o formulário ou ligue para solicitar informações.",
  scripts: ["eventos.js"],
  body: () => `
<section class="page-hero" aria-labelledby="eventos-title">
  <div class="container page-hero__split">
    <div>
      <p class="eyebrow eyebrow--on-dark">Eventos</p>
      <h1 class="display display--md" id="eventos-title">Quer um food truck de hot dog no seu evento?</h1>
      <p class="page-hero__lead">Não perca tempo: preencha o formulário e fale com a gente. A Kombi's leva o charme da Kombi e o hot dog da casa até você.</p>
    </div>
    <div class="page-hero__kombi">${img(IMAGES.kombi, { eager: true, sizes: "(min-width: 960px) 480px, 80vw" })}</div>
  </div>
</section>

<section class="section">
  <div class="container events-page">
    <form class="card-form" data-event-form novalidate aria-labelledby="form-title">
      <h2 class="h3" id="form-title">Solicite informações</h2>
      <div class="field">
        <label for="ev-name">Nome <span aria-hidden="true">*</span></label>
        <input id="ev-name" name="nome" autocomplete="name" required aria-describedby="ev-name-err">
        <p class="field-error" id="ev-name-err" hidden></p>
      </div>
      <div class="field">
        <label for="ev-email">E-mail <span aria-hidden="true">*</span></label>
        <input id="ev-email" name="email" type="email" autocomplete="email" required aria-describedby="ev-email-err">
        <p class="field-error" id="ev-email-err" hidden></p>
      </div>
      <div class="field">
        <label for="ev-event">Evento <span aria-hidden="true">*</span></label>
        <input id="ev-event" name="evento" required placeholder="Ex.: aniversário, casamento, confraternização" aria-describedby="ev-event-err">
        <p class="field-error" id="ev-event-err" hidden></p>
      </div>
      <div class="field">
        <label for="ev-details">Detalhes do evento <span class="optional">(opcional)</span></label>
        <textarea id="ev-details" name="detalhes" rows="4" placeholder="Data, cidade/local, número aproximado de convidados…"></textarea>
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="submit" data-event-submit>${icon("whatsapp")}<span>${SITE.events.formEndpoint ? "Enviar solicitação" : "Enviar pelo WhatsApp"}</span></button>
      <p class="form-status" data-event-status role="status" aria-live="polite"></p>
    </form>

    <aside class="events-aside">
      <h2 class="h4">Prefere ligar?</h2>
      <p>Fale direto com a equipe de eventos:</p>
      <ul class="phone-list" role="list">
        ${SITE.events.phones.map((p) => `<li><a class="btn btn--outline" href="tel:+${p.e164}">${icon("phone")}<span>${p.label}</span></a></li>`).join("")}
      </ul>
      <figure class="events-aside__photo">${img(IMAGES.especial, { sizes: "(min-width: 960px) 360px, 90vw", alt: "Kombi Especial" })}</figure>
    </aside>
  </div>
</section>`,
};
