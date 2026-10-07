const WHATSAPP_PHONE = ""; // Opcional: número com DDI e DDD, apenas números. Ex.: 5511999999999

const categories = {
  favoritos: { label: "Queridinhos da casa", className: "" },
  pratos: { label: "Pratos da casa", className: "secondary-group" },
  acompanhamentos: { label: "Acompanhamentos", className: "secondary-group" },
  bebidas: { label: "Bebidas", className: "secondary-group" },
};

const products = [
  { id: "bowl-horta", name: "Bowl da horta", description: "Arroz soltinho, legumes grelhados, folhas frescas e nosso molho de ervas.", price: 28, category: "favoritos", tag: "MAIS PEDIDO", time: "25 min", image: "photo-1547592180-85f173990554", alt: "Bowl colorido com folhas, legumes e grãos", favorite: true },
  { id: "salada-vivida", name: "Salada bem vivida", description: "Mix de folhas, tomate docinho, cenoura, grãos e crocantes da casa.", price: 24, category: "favoritos", tag: "LEVE E FRESCO", time: "20 min", image: "photo-1546069901-ba9599a7e63c", alt: "Salada fresca com vegetais coloridos", favorite: true },
  { id: "prato-dia", name: "Prato de todo dia", description: "Arroz, feijão, legumes da estação e carinho em forma de almoço.", price: 32, category: "pratos", tag: "DA CASA", time: "30 min", image: "photo-1547592180-85f173990554", alt: "Prato caseiro com vegetais frescos" },
  { id: "verde-inteiro", name: "Verde por inteiro", description: "Legumes assados, folhas crocantes e molho cítrico de tahine.", price: 30, category: "pratos", tag: "VEGETARIANO", time: "25 min", image: "photo-1512621776951-a57141f2eefd", alt: "Salada e legumes frescos preparados para servir" },
  { id: "legumes-assados", name: "Legumes assados", description: "Seleção da estação assada com azeite, ervas e flor de sal.", price: 12, category: "acompanhamentos", tag: "DA ESTAÇÃO", image: "photo-1512621776951-a57141f2eefd", alt: "Legumes frescos e coloridos" },
  { id: "arroz-ervas", name: "Arroz de ervas", description: "Arroz soltinho finalizado com ervas frescas da casa.", price: 9, category: "acompanhamentos", tag: "FEITO NA HORA", image: "photo-1512621776951-a57141f2eefd", alt: "Acompanhamento preparado com ingredientes frescos" },
  { id: "suco-laranja", name: "Suco de laranja", description: "Laranjas frescas espremidas na hora. 300 ml.", price: 9, category: "bebidas", tag: "NATURAL", image: "photo-1613478223719-2ab802602423", alt: "Suco natural de laranja" },
  { id: "cha-gelado", name: "Chá da casa", description: "Chá gelado de hibisco com limão e um toque de mel. 300 ml.", price: 8, category: "bebidas", tag: "DA CASA", image: "photo-1556679343-c7306c1976bc", alt: "Chá gelado servido com gelo" },
];

const cart = new Map();
const menuContent = document.querySelector("#menu-content");
const cartDialog = document.querySelector("#cart-dialog");
const cartItems = document.querySelector("#cart-items");
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function imageUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=85`;
}

function renderMenu(categoryId = "favoritos") {
  const visibleProducts = categoryId === "favoritos"
    ? products.filter((product) => product.favorite)
    : products.filter((product) => product.category === categoryId);
  const category = categories[categoryId];

  menuContent.innerHTML = `
    <section class="menu-group ${category.className}" aria-labelledby="group-title">
      <div class="group-heading"><h3 id="group-title">${category.label}</h3><span>${String(visibleProducts.length).padStart(2, "0")} opções</span></div>
      <div class="product-grid">
        ${visibleProducts.map((product) => `
          <article class="product-card ${categoryId !== "favoritos" ? "compact-card" : ""}">
            <img class="product-image" src="${imageUrl(product.image)}" alt="${product.alt}" loading="lazy" />
            <div class="product-content">
              <div class="product-topline"><span class="product-tag ${product.favorite ? "" : "tag-soft"}">${product.tag}</span>${product.time ? `<span class="product-time">◷ ${product.time}</span>` : ""}</div>
              <h4>${product.name}</h4><p>${product.description}</p>
              <div class="product-bottom"><strong>${money.format(product.price)}</strong><button class="add-product" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao pedido">＋</button></div>
            </div>
          </article>`).join("")}
      </div>
    </section>`;
}

function cartSummary() {
  const quantity = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  const total = [...cart.values()].reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  document.querySelector("#cart-count").textContent = quantity;
  document.querySelector("#bar-total").textContent = money.format(total);
  document.querySelector("#bar-caption").textContent = quantity === 1 ? "1 item no pedido" : `${quantity} itens no pedido`;
  document.querySelector("#view-cart").disabled = quantity === 0;
  return { quantity, total };
}

function renderCart() {
  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu pedido está vazio. Escolha algo gostoso do cardápio.</p>';
  } else {
    cartItems.innerHTML = [...cart.values()].map(({ product, quantity }) => `
      <div class="cart-row">
        <div class="cart-row-info"><strong>${product.name}</strong><span>${money.format(product.price)} cada</span></div>
        <div class="quantity-control" aria-label="Quantidade de ${product.name}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remover um ${product.name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Adicionar um ${product.name}">＋</button>
        </div>
      </div>`).join("");
  }
  const { total } = cartSummary();
  document.querySelector("#cart-total").textContent = money.format(total);
}

document.querySelector(".category-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  document.querySelectorAll(".category-chip").forEach((chip) => {
    const isActive = chip === button;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderMenu(button.dataset.category);
});

menuContent.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.add);
  const existing = cart.get(product.id);
  cart.set(product.id, { product, quantity: (existing?.quantity ?? 0) + 1 });
  cartSummary();
  button.textContent = "✓";
  window.setTimeout(() => { if (button.isConnected) button.textContent = "＋"; }, 650);
});

document.querySelector("#view-cart").addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});
document.querySelector(".close-dialog").addEventListener("click", () => cartDialog.close());

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const id = button.dataset.quantity;
  const entry = cart.get(id);
  entry.quantity += Number(button.dataset.change);
  if (entry.quantity <= 0) cart.delete(id);
  renderCart();
});

document.querySelector("#whatsapp-order").addEventListener("click", () => {
  if (cart.size === 0) return;
  const { total } = cartSummary();
  const lines = [...cart.values()].map(({ product, quantity }) => `${quantity}x ${product.name} — ${money.format(product.price * quantity)}`);
  const message = ["Olá! Quero fazer este pedido:", "", ...lines, "", `Total: ${money.format(total)}`].join("\n");
  const phone = WHATSAPP_PHONE.replace(/\D/g, "");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

renderMenu();
cartSummary();
