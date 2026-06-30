/* ==========================================================================
   Product catalogue + shopping cart (front-end only, localStorage based)
   ========================================================================== */

const WHATSAPP_NUMBER = "27000000000"; // TODO: replace with real number, no +, no spaces

const PRODUCTS = [
  {
    id: "imphepho",
    name: "Imphepho Bundle",
    category: "incense",
    price: 85,
    blurb: "Dried imphepho for cleansing and connecting with ancestors before consultation or ritual.",
    image: "images/product-imphepho.svg"
  },
  {
    id: "herbal-mix",
    name: "House Herbal Mixture",
    category: "herbal",
    price: 220,
    blurb: "A hand-blended mixture prepared after consultation, tailored to general wellness support.",
    image: "images/product-herbal-mix.svg"
  },
  {
    id: "ubulawu",
    name: "Ubulawu Root Mix",
    category: "ritual",
    price: 180,
    blurb: "Traditional root preparation used in ceremony and spiritual strengthening practices.",
    image: "images/product-ubulawu.svg"
  },
  {
    id: "candle",
    name: "Healing Candle",
    category: "ritual",
    price: 95,
    blurb: "Slow-burning candle prepared for use during prayer, reflection, or home cleansing.",
    image: "images/product-candle.svg"
  },
  {
    id: "bracelet",
    name: "Isiphandla Beaded Band",
    category: "adornment",
    price: 150,
    blurb: "Hand-beaded wrist band, made to order in colours appropriate to your consultation.",
    image: "images/product-bracelet.svg"
  },
  {
    id: "giftset",
    name: "Consultation Gift Set",
    category: "herbal",
    price: 350,
    blurb: "A curated starter set for those new to consultation — imphepho, candle, and herbal mix.",
    image: "images/product-giftset.svg"
  }
];

const CART_KEY = "makhosi_cart_v1";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
  renderCartDrawer();
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  openCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
}

function cartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function cartTotal() {
  const cart = getCart();
  let total = 0;
  for (const id in cart) {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) total += product.price * cart[id];
  }
  return total;
}

function renderCartCount() {
  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = cartCount();
  });
}

function formatPrice(n) {
  return "R" + n.toFixed(2);
}

function renderCartDrawer() {
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!itemsEl) return;

  const cart = getCart();
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your order is empty. Add a remedy to get started.</p>';
  } else {
    itemsEl.innerHTML = ids.map(id => {
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return "";
      const qty = cart[id];
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-meta">
              <button class="qty-btn" data-action="dec" data-id="${id}" aria-label="Decrease quantity">-</button>
              <span>${qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
              <button class="remove-btn" data-action="remove" data-id="${id}">Remove</button>
            </div>
          </div>
          <div class="price">${formatPrice(product.price * qty)}</div>
        </div>
      `;
    }).join("");
  }

  if (totalEl) totalEl.textContent = formatPrice(cartTotal());

  itemsEl.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "inc") changeQty(id, 1);
      if (action === "dec") changeQty(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  });
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
}

function buildWhatsAppOrderLink() {
  const cart = getCart();
  const ids = Object.keys(cart);
  if (ids.length === 0) return `https://wa.me/${WHATSAPP_NUMBER}`;

  let message = "Hi Makhosi, I'd like to place an order:%0A%0A";
  ids.forEach(id => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    message += `- ${product.name} x${cart[id]} (${formatPrice(product.price * cart[id])})%0A`;
  });
  message += `%0ATotal: ${formatPrice(cartTotal())}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

/* ---------- Product grid rendering (products.html only) ---------- */

function renderProductsGrid(filter = "all") {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-media">
        <img src="${p.image}" alt="${p.name} — placeholder image, replace with real product photo">
      </div>
      <div class="product-body">
        <span class="eyebrow">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.blurb}</p>
        <div class="product-footer">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartCount();
  renderCartDrawer();
  renderProductsGrid();

  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCart);
  document.getElementById("openCart")?.addEventListener("click", openCart);

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if (cartCount() === 0) return;
    window.location.href = "checkout.html";
  });

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderProductsGrid(chip.dataset.filter);
    });
  });
});
