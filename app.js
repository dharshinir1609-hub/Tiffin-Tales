// app.js: the brain of the website. Data -> state -> render -> events.
import menu, { coupons } from "./menu.js";
import { formatPrice, findItem, spiceDots, calcBill, validateOrder, makeOrderId } from "./utils.js";

// ---------- 1. State: everything that can change ----------
const state = {
  query: "",
  category: "all",
  vegOnly: false,
  sort: "default",
  cart: [],        // e.g. [{ id: 1, qty: 2 }]
  coupon: "",
  orderCount: 0
};

// ---------- 2. Grab the elements once ----------
const grid = document.querySelector("#menu-grid");
const search = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const vegOnly = document.querySelector("#veg-only");
const chips = document.querySelector("#chips");
const resultInfo = document.querySelector("#result-info");
const cartList = document.querySelector("#cart-list");
const cartCount = document.querySelector("#cart-count");
const couponForm = document.querySelector("#coupon-form");
const couponInput = document.querySelector("#coupon-input");
const couponMsg = document.querySelector("#coupon-msg");
const billEl = document.querySelector("#bill");
const checkoutForm = document.querySelector("#checkout-form");
const placeBtn = document.querySelector("#place-btn");
const confirmation = document.querySelector("#confirmation");

// ---------- 3. Templates: data in, HTML string out ----------
function dishHTML(item) {
  const { id, name, price, veg, rating, inStock } = item;
  const badge = item.badge ?? "";
  const spiceLevel = item.spice?.level ?? 0;
  return `
    <li class="dish ${inStock ? "" : "sold-out"}" data-id="${id}">
      <div class="dish-top">
        <span class="diet ${veg ? "veg" : "nonveg"}" title="${veg ? "Veg" : "Non-veg"}"></span>
        ${badge ? `<span class="badge">${badge}</span>` : ""}
      </div>
      <h3>${name}</h3>
      <p class="meta">★ ${rating.toFixed(1)} · <span class="spice">${spiceDots(spiceLevel)}</span></p>
      <div class="dish-bottom">
        <span class="price">${formatPrice(price)}</span>
        <button class="add-btn" ${inStock ? "" : "disabled"}>${inStock ? "Add" : "Sold out"}</button>
      </div>
    </li>`;
}

function cartItemHTML({ id, qty }) {
  const { name, price } = findItem(menu, id);
  return `
    <li data-id="${id}">
      <span class="ci-name">${name}</span>
      <span class="qty">
        <button data-action="dec" aria-label="One less">−</button>
        <b>${qty}</b>
        <button data-action="inc" aria-label="One more">+</button>
      </span>
      <span class="ci-price">${formatPrice(price * qty)}</span>
    </li>`;
}

// ---------- 4. Work out what to show, from state ----------
function visibleItems() {
  const q = state.query.trim().toLowerCase();
  const list = menu
    .filter(item => state.category === "all" || item.category === state.category)
    .filter(item => !state.vegOnly || item.veg)
    .filter(item => item.name.toLowerCase().includes(q));

  if (state.sort === "price-low") return [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "price-high") return [...list].sort((a, b) => b.price - a.price);
  if (state.sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
  return list;
}

// ---------- 5. Render: state -> screen ----------
function renderMenu() {
  const list = visibleItems();
  resultInfo.textContent = `Showing ${list.length} of ${menu.length} dishes`;
  grid.innerHTML = list.length > 0
    ? list.map(dishHTML).join("")
    : `<li class="empty">No dishes match. Try another search or category.</li>`;
  chips.querySelectorAll(".chip").forEach(chip =>
    chip.classList.toggle("active", chip.dataset.cat === state.category));
}

function renderCart() {
  const bill = calcBill(state.cart, menu, state.coupon, coupons);
  cartCount.textContent = bill.itemCount;
  cartList.innerHTML = state.cart.length > 0
    ? state.cart.map(cartItemHTML).join("")
    : `<li class="empty">Your cart is empty. Add something tasty!</li>`;
  couponMsg.textContent = bill.message;
  couponMsg.classList.toggle("ok", bill.discount > 0);
  const deliveryText = bill.delivery === 0 && bill.subtotal > 0 ? "FREE" : formatPrice(bill.delivery);
  billEl.innerHTML = `
    <dt>Subtotal</dt><dd>${formatPrice(bill.subtotal)}</dd>
    <dt>Discount</dt><dd>− ${formatPrice(bill.discount)}</dd>
    <dt>GST (5%)</dt><dd>${formatPrice(bill.gst)}</dd>
    <dt>Delivery</dt><dd>${deliveryText}</dd>
    <dt class="total">Total</dt><dd class="total">${formatPrice(bill.total)}</dd>`;
  placeBtn.disabled = state.cart.length === 0;
}

function render() {
  renderMenu();
  renderCart();
}

// ---------- 6. Cart logic ----------
function changeQty(id, change) {
  const line = state.cart.find(item => item.id === id);
  if (line) {
    line.qty += change;
  } else if (change > 0) {
    state.cart.push({ id, qty: 1 });
  }
  state.cart = state.cart.filter(item => item.qty > 0);
}

// ---------- 7. Events: change state, then render ----------
search.addEventListener("input", e => {
  state.query = e.target.value;
  render();
});

sortSelect.addEventListener("change", e => {
  state.sort = e.target.value;
  render();
});

vegOnly.addEventListener("change", e => {
  state.vegOnly = e.target.checked;
  render();
});

chips.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.category = chip.dataset.cat;
  render();
});

grid.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const id = Number(btn.closest(".dish").dataset.id);
  changeQty(id, 1);
  render();
});

cartList.addEventListener("click", e => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = Number(btn.closest("li").dataset.id);
  changeQty(id, btn.dataset.action === "inc" ? 1 : -1);
  render();
});

couponForm.addEventListener("submit", e => {
  e.preventDefault();
  state.coupon = couponInput.value.trim().toUpperCase();
  render();
});

checkoutForm.addEventListener("submit", e => {
  e.preventDefault();
  if (state.cart.length === 0) return;   // never place an empty order
  const details = {
    name: document.querySelector("#name").value,
    phone: document.querySelector("#phone").value,
    address: document.querySelector("#address").value
  };

  const errors = validateOrder(details);
  checkoutForm.querySelectorAll(".error").forEach(small => {
    const field = small.dataset.errorFor;
    small.textContent = errors[field] ?? "";
    document.querySelector(`#${field}`).classList.toggle("invalid", Boolean(errors[field]));
  });
  if (Object.keys(errors).length > 0) return;

  state.orderCount++;
  const order = {
    ...details,
    id: makeOrderId(details.name, state.orderCount),
    items: state.cart.map(line => ({ ...line })),   // a COPY, not the same array
    bill: calcBill(state.cart, menu, state.coupon, coupons)
  };

  showConfirmation(order);
  state.cart = [];
  state.coupon = "";
  couponInput.value = "";
  checkoutForm.reset();
  render();
});

// Clear a field's error as soon as the user starts fixing it (one listener for all three inputs)
checkoutForm.addEventListener("input", e => {
  const small = checkoutForm.querySelector(`[data-error-for="${e.target.id}"]`);
  if (small) small.textContent = "";
  e.target.classList.remove("invalid");
});

// ---------- 8. Confirmation popup (built with createElement) ----------
function showConfirmation(order) {
  const box = document.createElement("div");
  box.className = "confirm-box";

  const title = document.createElement("h2");
  title.textContent = "Order placed!";

  const idLine = document.createElement("p");
  idLine.className = "order-id";
  idLine.textContent = order.id;

  const details = document.createElement("p");
  details.textContent = `Thank you, ${order.name.trim()}! ${order.bill.itemCount} items, total ${formatPrice(order.bill.total)}. Your food arrives in 30 minutes.`;

  const close = document.createElement("button");
  close.textContent = "Order something else";
  close.addEventListener("click", () => {
    confirmation.hidden = true;
    box.remove();
  });

  box.append(title, idLine, details, close);
  confirmation.append(box);
  confirmation.hidden = false;
}

// ---------- 9. First paint ----------
render();
