/**
 * Natural Glow — E-commerce Site
 */

const PRODUCTS = [
  {
    id: "skin-polish",
    name: "Skin Polish",
    category: "Exfoliator",
    description: "Gentle micro-exfoliating polish that buffs away dullness and reveals silky-smooth, radiant skin.",
    price: 24.99,
    originalPrice: 29.99,
    badge: "Bestseller",
    icon: "polish",
  },
  {
    id: "whitening-serum",
    name: "Whitening Serum",
    category: "Serum",
    description: "Lightweight brightening serum with vitamin C and niacinamide to even tone and boost your natural glow.",
    price: 34.99,
    originalPrice: 39.99,
    badge: "Popular",
    icon: "serum",
  },
  {
    id: "whitening-cream",
    name: "Whitening Cream",
    category: "Moisturizer",
    description: "Rich yet airy cream that hydrates deeply while targeting dark spots for a luminous, even complexion.",
    price: 28.99,
    originalPrice: 32.99,
    badge: "New",
    icon: "cream",
  },
];

const PRODUCT_ICONS = {
  polish: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="55" rx="22" ry="8" fill="currentColor" opacity="0.2"/>
    <rect x="28" y="12" width="24" height="42" rx="6" stroke="currentColor" stroke-width="2"/>
    <path d="M32 18h16M34 28h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  serum: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 8h10v8l-4 6v38a6 6 0 01-12 0V22l-4-6V8z" stroke="currentColor" stroke-width="2"/>
    <rect x="32" y="4" width="16" height="6" rx="2" fill="currentColor" opacity="0.3"/>
    <ellipse cx="40" cy="58" rx="8" ry="4" fill="currentColor" opacity="0.15"/>
  </svg>`,
  cream: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="58" rx="26" ry="10" fill="currentColor" opacity="0.2"/>
    <path d="M22 38c0-12 8-22 18-22s18 10 18 22v12H22V38z" stroke="currentColor" stroke-width="2"/>
    <path d="M30 20c4-6 16-6 20 0" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,
};

const CART_KEY = "naturalGlowCart";

let cart = loadCart();

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("toast--visible");
  setTimeout(() => toast.classList.remove("toast--visible"), 2800);
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__image">
        ${PRODUCT_ICONS[p.icon]}
        ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ""}
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${p.category}</span>
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.description}</p>
        <div class="product-card__footer">
          <span class="product-card__price">
            ${formatPrice(p.price)}
            <small>${formatPrice(p.originalPrice)}</small>
          </span>
          <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `
  ).join("");

  grid.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart();
  updateCartUI();
  const product = PRODUCTS.find((p) => p.id === productId);
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const totalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const count = getCartCount();

  countEl.textContent = count;
  countEl.style.display = count > 0 ? "flex" : "none";

  const total = getCartTotal();
  totalEl.textContent = formatPrice(total);

  if (cart.length === 0) {
    emptyEl.style.display = "block";
    itemsEl.querySelectorAll(".cart-item").forEach((el) => el.remove());
    checkoutBtn.disabled = true;
    return;
  }

  emptyEl.style.display = "none";
  checkoutBtn.disabled = false;

  const existingItems = itemsEl.querySelectorAll(".cart-item");
  existingItems.forEach((el) => el.remove());

  cart.forEach((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item__thumb">${PRODUCT_ICONS[product.icon]}</div>
      <div class="cart-item__info">
        <p class="cart-item__name">${product.name}</p>
        <p class="cart-item__price">${formatPrice(product.price * item.qty)}</p>
        <div class="cart-item__qty">
          <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-item__remove" data-action="remove" data-id="${item.id}" aria-label="Remove item">&times;</button>
    `;
    itemsEl.appendChild(div);
  });

  itemsEl.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { action, id } = btn.dataset;
      if (action === "remove") removeFromCart(id);
      else if (action === "increase") updateQuantity(id, 1);
      else if (action === "decrease") updateQuantity(id, -1);
    });
  });
}

function openCart() {
  document.getElementById("cartOverlay").classList.add("cart-overlay--visible");
  document.getElementById("cartPanel").classList.add("cart-panel--open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("cart-overlay--visible");
  document.getElementById("cartPanel").classList.remove("cart-panel--open");
  document.body.style.overflow = "";
}

function initCart() {
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;
    document.getElementById("checkoutTotal").textContent = formatPrice(getCartTotal());
    document.getElementById("checkoutModal").showModal();
    closeCart();
  });

  document.getElementById("checkoutClose").addEventListener("click", () => {
    document.getElementById("checkoutModal").close();
  });

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("checkoutModal").close();
    cart = [];
    saveCart();
    updateCartUI();
    document.getElementById("checkoutForm").reset();
    document.getElementById("successModal").showModal();
  });

  document.getElementById("successClose").addEventListener("click", () => {
    document.getElementById("successModal").close();
  });
}

function initHeader() {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  window.addEventListener("scroll", () => {
    header.classList.toggle("header--scrolled", window.scrollY > 20);
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initContactForm() {
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon.");
    e.target.reset();
  });
}

function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderProducts();
  updateCartUI();
  initCart();
  initHeader();
  initContactForm();
}

document.addEventListener("DOMContentLoaded", init);
