# Kombi's Hot Dog — site

Site estático, sem dependências externas (só Node.js ≥ 20 para o build). Gera HTML pronto para SEO e usa ES modules no navegador para carrinho, pedido e interações.

## Rodar localmente

```bash
npm start              # build + servidor em http://localhost:4173
npm test               # build + testes (carrinho, horários, dados, páginas geradas)
npm run check:browser  # Chrome/Edge headless: console, layout em 3 larguras, fluxo de pedido e screenshots em .checks/
```

Para publicar, envie o conteúdo de `dist/` para qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages, Hostinger…). Configure a página `404.html` e o redirecionamento das URLs antigas sem barra (`/cardapio` → `/cardapio/`), que a maioria dos hosts já faz sozinha.

## Onde alterar cada coisa

| O quê | Arquivo |
|---|---|
| Unidades (endereço, WhatsApp, telefone, horário) | `src/data/units.js` |
| Cardápio, preços, adicionais, bebidas | `src/data/menu.js` |
| Fotos | `src/data/images.js` (+ `scripts/optimize-images.py` para gerar novas) |
| Redes sociais, contatos de eventos, endpoint do formulário | `src/data/site.js` |
| Cores, fontes, espaçamentos | `src/styles/tokens.css` |

## Estrutura

```
src/
  data/        fonte única de dados (copiados do site oficial)
  lib/         lógica pura: carrinho/mensagem, horários, formatação (testada)
  components/  funções que geram HTML — usadas no build e no navegador
  pages/       uma por rota: /, /cardapio/, /pedido/, /sobre/, /eventos/, /parceiros/, /menu/ (redireciona), 404
  client/      scripts do navegador (main + um por página)
  styles/      tokens → base → componentes → páginas (concatenados no build)
  assets/img/  fotos oficiais otimizadas em WebP
scripts/       build, servidor local, verificação em navegador, otimização de imagens
tests/         node:test
```

## Como o pedido funciona

O site não tem sistema de pagamento nem integração com plataforma de delivery, assim como o site anterior. O cliente monta o pedido (itens, adicionais, retirar ingredientes, observações), escolhe unidade e entrega/retirada, revisa a mensagem e ela é aberta no **WhatsApp da unidade escolhida**. Entrega e retirada usam os números publicados para cada unidade (na Kombi's 1 eles são diferentes). O site deixa claro que o pedido só é confirmado quando a unidade responde.

## Pendências que dependem da Kombi's

- **Horário da Kombi's 1:** a página inicial antiga diz 19:00–23:59, a página /pedido diz 19:00–23:00. Mantido 23:59; por isso essa unidade não tem horário nos dados estruturados do Google.
- **Preços de adicionais e bebidas:** não são divulgados no site antigo. Aparecem como "Consulte" / "valor a confirmar" e não entram no subtotal.
- **Formulário de eventos:** o original era um Wix Forms, que enviava para o e-mail cadastrado no Wix e não funciona fora dele. Hoje o formulário abre o WhatsApp (19) 99637-6572 com os dados preenchidos. Confirme que esse número tem WhatsApp. Para receber por e-mail, crie um endpoint (ex.: Formspree) e coloque a URL em `SITE.events.formEndpoint`.
- **Formas de pagamento:** não divulgadas; o campo é livre e opcional.
- **Página Parceiros:** o site antigo não tinha contato específico; o botão leva ao Instagram e ao Facebook oficiais.
- **Fotos:** a mesma foto oficial é usada para vários hot dogs (como no site antigo). Esses itens aparecem marcados como "foto ilustrativa". Fotos individuais de cada produto deixariam o cardápio muito melhor.
- **Endereço da Kombi's 4:** o site antigo escreve "Jhon Boyd Dunlop"; corrigido para "John Boyd Dunlop".
- **CNPJ / dados legais:** não publicados no site antigo, então não foram incluídos.
