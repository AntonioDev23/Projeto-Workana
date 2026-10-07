# Mesa Boa — cardápio digital

Projeto de prática inspirado em um anúncio do Workana. É um cardápio demonstrativo com HTML, CSS e JavaScript, pensado primeiro para celular.

## Abrir no computador

Abra `index.html` no navegador. As imagens usam um serviço externo e precisam de conexão com a internet. O site usa Arial, disponível no sistema.

## Configurar o WhatsApp

No começo de `app.js`, preencha `WHATSAPP_PHONE` com o número do restaurante usando código do país, DDD e número, sem espaços ou símbolos. Exemplo de formato: `5511999999999`. Se ficar vazio, o WhatsApp abre para você escolher a conversa.

O pedido é montado no navegador. O cliente ainda revisa e confirma o envio dentro do WhatsApp; este projeto não tem servidor nem recebe pedidos sozinho.

## Editar o cardápio

Os produtos, preços, categorias e imagens ficam no array `products`, no começo de `app.js`. O nome e a identidade visual da marca podem ser alterados em `index.html`, `styles.css` e `assets/logo.svg`.
