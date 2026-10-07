const WHATSAPP_PHONE = ""; // Opcional: número com DDI e DDD, apenas números. Ex.: 5511999999999

const categories = {
  favoritos: { label: "Mais pedidos", className: "" },
  pratos: { label: "Monte sua marmita", className: "secondary-group" },
  acompanhamentos: { label: "Acompanhamentos", className: "secondary-group" },
  bebidas: { label: "Bebidas", className: "secondary-group" },
};

const proteins = {
  traditional: ["Frango grelhado", "Carne de panela", "Lombo suíno", "Frango à milanesa", "Almôndega caseira"],
  light: ["Frango grelhado", "Patinho em tiras", "Omelete de claras", "Hambúrguer de lentilha"],
};
const sideOptions = ["Purê de batata", "Macarrão alho e óleo", "Couve refogada", "Legumes salteados", "Farofa caseira", "Abóbora assada"];

const products = [
  { id: "marmita-tradicional", name: "Marmita tradicional", description: "Arroz e feijão inclusos. Escolha proteína, tamanho e acompanhamentos.", category: "pratos", type: "custom", tag: "MAIS PEDIDA", time: "35 min", image: "photo-1547592180-85f173990554", alt: "Marmita caseira com arroz, feijão e acompanhamentos", favorite: true, proteinSet: "traditional", sizes: [{ id: "p", label: "Pequena", price: 20.9, proteins: 1, sides: 1 }, { id: "m", label: "Média", price: 26.9, proteins: 1, sides: 2 }, { id: "g", label: "Grande", price: 33.9, proteins: 2, sides: 2 }] },
  { id: "marmita-leve", name: "Marmita leve", description: "Arroz integral e feijão inclusos. Proteínas grelhadas e acompanhamentos da estação.", category: "pratos", type: "custom", tag: "LEVE", time: "30 min", image: "photo-1512621776951-a57141f2eefd", alt: "Refeição leve com vegetais frescos", favorite: true, proteinSet: "light", sizes: [{ id: "p", label: "Pequena", price: 22.9, proteins: 1, sides: 1 }, { id: "m", label: "Média", price: 28.9, proteins: 1, sides: 2 }, { id: "g", label: "Grande", price: 35.9, proteins: 2, sides: 2 }] },
  { id: "farofa", name: "Farofa da casa", description: "Porção individual, dourada na manteiga e finalizada com cheiro-verde.", price: 5, category: "acompanhamentos", tag: "EXTRA", image: "photo-1512621776951-a57141f2eefd", alt: "Acompanhamento de farofa caseira" },
  { id: "salada-extra", name: "Salada do dia", description: "Folhas frescas e legumes conforme a seleção da estação.", price: 7, category: "acompanhamentos", tag: "FRESQUINHA", image: "photo-1546069901-ba9599a7e63c", alt: "Salada fresca com vegetais variados" },
  { id: "pure-extra", name: "Purê de batata", description: "Porção individual, cremosa e feita na cozinha da casa.", price: 6, category: "acompanhamentos", tag: "EXTRA", image: "photo-1547592180-85f173990554", alt: "Acompanhamento de purê servido com refeição" },
  { id: "suco-laranja", name: "Suco de laranja", description: "Laranjas frescas espremidas na hora. 300 ml.", price: 9, category: "bebidas", tag: "NATURAL", image: "photo-1613478223719-2ab802602423", alt: "Suco natural de laranja" },
  { id: "cha-gelado", name: "Chá gelado da casa", description: "Hibisco com limão e um toque de mel. 300 ml.", price: 8, category: "bebidas", tag: "DA CASA", image: "photo-1556679343-c7306c1976bc", alt: "Chá gelado servido com gelo" },
  { id: "refrigerante", name: "Refrigerante lata", description: "Lata de 350 ml. Consulte os sabores disponíveis.", price: 7, category: "bebidas", tag: "350 ML", imageSrc: "assets/refrigerante-foto.jpg", alt: "Foto de uma lata azul de refrigerante sem marca" },
];

const cart = new Map();
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const menuContent = document.querySelector("#menu-content");
const cartDialog = document.querySelector("#cart-dialog");
const cartItems = document.querySelector("#cart-items");
const mealDialog = document.querySelector("#meal-dialog");
const mealForm = document.querySelector("#meal-form");
let selectedMeal = null;
let selectedSize = null;
let selectedProteins = new Set();
let selectedSides = new Set();

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
        ${visibleProducts.map((product) => {
          const custom = product.type === "custom";
          const price = custom ? `A partir de ${money.format(product.sizes[0].price)}` : money.format(product.price);
          const button = custom
            ? `<button class="configure-product" type="button" data-configure="${product.id}" aria-label="Personalizar ${product.name}">Montar <span aria-hidden="true">→</span></button>`
            : `<button class="add-product" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao pedido">＋</button>`;
          return `
            <article class="product-card ${categoryId !== "favoritos" ? "compact-card" : ""}">
            <img class="product-image" src="${product.imageSrc ?? imageUrl(product.image)}" alt="${product.alt}" loading="lazy" />
              <div class="product-content">
                <div class="product-topline"><span class="product-tag ${product.favorite ? "" : "tag-soft"}">${product.tag}</span>${product.time ? `<span class="product-time">◷ ${product.time}</span>` : ""}</div>
                <h4>${product.name}</h4><p>${product.description}</p>
                <div class="product-bottom"><strong>${price}</strong>${button}</div>
              </div>
            </article>`;
        }).join("")}
      </div>
    </section>`;
}

function addToCart(product) {
  const existing = cart.get(product.id);
  cart.set(product.id, { product, quantity: (existing?.quantity ?? 0) + 1 });
  cartSummary();
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
        <div class="cart-row-info"><strong>${product.name}</strong>${product.details ? `<small>${product.details}</small>` : ""}<span>${money.format(product.price)} cada</span></div>
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

function openMealBuilder(product) {
  selectedMeal = product;
  selectedSize = product.sizes[0];
  selectedProteins = new Set();
  selectedSides = new Set();
  document.querySelector("#meal-title").textContent = product.name;
  document.querySelector("#meal-intro").textContent = product.description;
  renderMealChoices();
  mealDialog.showModal();
}

function renderMealChoices() {
  document.querySelector("#size-options").innerHTML = selectedMeal.sizes.map((size) => `
    <label class="size-option ${size.id === selectedSize.id ? "selected" : ""}">
      <input type="radio" name="meal-size" value="${size.id}" ${size.id === selectedSize.id ? "checked" : ""} />
      <span><strong>${size.label}</strong><small>${size.proteins} proteína${size.proteins > 1 ? "s" : ""} · ${money.format(size.price)}</small></span>
    </label>`).join("");
  const availableProteins = proteins[selectedMeal.proteinSet];
  document.querySelector("#protein-rule").textContent = `Escolha ${selectedSize.proteins}`;
  document.querySelector("#side-rule").textContent = `Escolha ${selectedSize.sides}`;
  document.querySelector("#size-rule").textContent = "Arroz e feijão inclusos";
  document.querySelector("#protein-options").innerHTML = availableProteins.map((name) => `
    <label class="choice-option"><input type="checkbox" name="meal-protein" value="${name}" ${selectedProteins.has(name) ? "checked" : ""} /><span>${name}</span></label>`).join("");
  document.querySelector("#side-options").innerHTML = sideOptions.map((name) => `
    <label class="choice-option"><input type="checkbox" name="meal-side" value="${name}" ${selectedSides.has(name) ? "checked" : ""} /><span>${name}</span></label>`).join("");
  updateMealSummary();
}

function updateMealSummary() {
  const validProteins = selectedProteins.size === selectedSize.proteins;
  const validSides = selectedSides.size === selectedSize.sides;
  document.querySelector("#meal-price").textContent = money.format(selectedSize.price);
  document.querySelector("#add-custom-meal").disabled = !(validProteins && validSides);
  const error = document.querySelector("#meal-error");
  if (validProteins && validSides) error.textContent = "";
  else if (selectedProteins.size > selectedSize.proteins) error.textContent = `Selecione no máximo ${selectedSize.proteins} proteína${selectedSize.proteins > 1 ? "s" : ""}.`;
  else if (selectedSides.size > selectedSize.sides) error.textContent = `Selecione no máximo ${selectedSize.sides} acompanhamentos.`;
  else error.textContent = `Falta escolher ${selectedSize.proteins - selectedProteins.size} proteína(s) e ${selectedSize.sides - selectedSides.size} acompanhamento(s).`;
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
  const configureButton = event.target.closest("[data-configure]");
  if (configureButton) {
    const product = products.find((item) => item.id === configureButton.dataset.configure);
    openMealBuilder(product);
    return;
  }
  const addButton = event.target.closest("[data-add]");
  if (!addButton) return;
  const product = products.find((item) => item.id === addButton.dataset.add);
  addToCart(product);
  addButton.textContent = "✓";
  window.setTimeout(() => { if (addButton.isConnected) addButton.textContent = "＋"; }, 650);
});

mealForm.addEventListener("change", (event) => {
  const { name, value, checked } = event.target;
  if (name === "meal-size") {
    selectedSize = selectedMeal.sizes.find((size) => size.id === value);
    selectedProteins.clear();
    selectedSides.clear();
    renderMealChoices();
    return;
  }
  const choices = name === "meal-protein" ? selectedProteins : name === "meal-side" ? selectedSides : null;
  if (!choices) return;
  const limit = name === "meal-protein" ? selectedSize.proteins : selectedSize.sides;
  if (checked && choices.size >= limit) {
    event.target.checked = false;
    document.querySelector("#meal-error").textContent = `Essa opção permite ${limit} escolha${limit > 1 ? "s" : ""} neste grupo.`;
    return;
  }
  if (checked) choices.add(value);
  else choices.delete(value);
  updateMealSummary();
});

mealForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedMeal || selectedProteins.size !== selectedSize.proteins || selectedSides.size !== selectedSize.sides) return;
  const details = `Proteínas: ${[...selectedProteins].join(", ")}. Acompanhamentos: arroz, feijão, ${[...selectedSides].join(", ")}.`;
  const product = {
    id: `${selectedMeal.id}-${selectedSize.id}-${Date.now()}`,
    name: `${selectedMeal.name} ${selectedSize.label.toLowerCase()}`,
    price: selectedSize.price,
    details,
  };
  addToCart(product);
  mealDialog.close();
  document.querySelector("#view-cart").focus();
});

document.querySelector("#view-cart").addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});
document.querySelector(".close-dialog").addEventListener("click", () => cartDialog.close());
document.querySelector(".close-meal").addEventListener("click", () => mealDialog.close());

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const entry = cart.get(button.dataset.quantity);
  if (!entry) return;
  entry.quantity += Number(button.dataset.change);
  if (entry.quantity <= 0) cart.delete(button.dataset.quantity);
  renderCart();
});

document.querySelector("#whatsapp-order").addEventListener("click", () => {
  if (cart.size === 0) return;
  const { total } = cartSummary();
  const lines = [...cart.values()].map(({ product, quantity }) => {
    const details = product.details ? `\n   ${product.details}` : "";
    return `${quantity}x ${product.name} — ${money.format(product.price * quantity)}${details}`;
  });
  const message = ["Olá! Quero fazer este pedido:", "", ...lines, "", `Total: ${money.format(total)}`].join("\n");
  const phone = WHATSAPP_PHONE.replace(/\D/g, "");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

renderMenu();
cartSummary();
