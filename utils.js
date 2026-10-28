// utils.js: pure helper functions. No DOM in here, so they are easy to test.

export const GST_RATE = 0.05;
export const FREE_DELIVERY_ABOVE = 499;
export const DELIVERY_FEE = 40;

export const formatPrice = amount => `₹${amount.toLocaleString("en-IN")}`;

export function findItem(menu, id) {
  return menu.find(item => item.id === id);
}

export function spiceDots(level = 0) {
  let dots = "";
  for (let i = 1; i <= 3; i++) {
    dots += i <= level ? "●" : "○";
  }
  return dots;
}

export function getDiscount(subtotal, code, coupons) {
  const coupon = coupons[code];
  if (!coupon) {
    return { amount: 0, message: code ? "Invalid coupon" : "" };
  }
  if (subtotal < coupon.minOrder) {
    return { amount: 0, message: `Add ₹${coupon.minOrder - subtotal} more to use ${code}` };
  }
  switch (coupon.type) {
    case "percent": {
      const amount = Math.min(Math.round(subtotal * coupon.value / 100), coupon.max);
      return { amount, message: `${code} applied: ${coupon.value}% off` };
    }
    case "flat":
      return { amount: coupon.value, message: `${code} applied: ₹${coupon.value} off` };
    default:
      return { amount: 0, message: "Invalid coupon" };
  }
}

export function calcBill(cart, menu, code = "", coupons = {}) {
  const subtotal = cart.reduce((sum, { id, qty }) => sum + findItem(menu, id).price * qty, 0);
  const itemCount = cart.reduce((count, { qty }) => count + qty, 0);
  const { amount: discount, message } = getDiscount(subtotal, code, coupons);
  const afterDiscount = subtotal - discount;
  const gst = Math.round(afterDiscount * GST_RATE);
  const delivery = subtotal === 0 || afterDiscount >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = afterDiscount + gst + delivery;
  return { itemCount, subtotal, discount, gst, delivery, total, message };
}

export function validateOrder({ name, phone, address }) {
  const errors = {};
  if (name.trim().length < 3) {
    errors.name = "Please enter your full name";
  }
  const digits = phone.trim();
  const onlyDigits = [...digits].every(ch => ch >= "0" && ch <= "9");
  if (digits.length !== 10 || !onlyDigits) {
    errors.phone = "Phone number must be exactly 10 digits";
  }
  if (address.trim().length < 10) {
    errors.address = "Please enter your full address";
  }
  return errors;
}

export function makeOrderId(name, orderNumber) {
  const initials = name
    .trim()
    .split(" ")
    .filter(word => word !== "")
    .map(word => word[0].toUpperCase())
    .join("");
  return `TT-${initials}-${String(orderNumber).padStart(4, "0")}`;
}
