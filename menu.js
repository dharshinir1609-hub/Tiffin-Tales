// menu.js: all the data for the café (the same for every student)

const menu = [
  { id: 1,  name: "Masala Dosa",          category: "breakfast", price: 90,  veg: true,  rating: 4.6, spice: { level: 1 }, badge: "Bestseller", inStock: true },
  { id: 2,  name: "Idli Vada",            category: "breakfast", price: 60,  veg: true,  rating: 4.4, inStock: true },
  { id: 3,  name: "Ven Pongal",           category: "breakfast", price: 70,  veg: true,  rating: 4.2, inStock: true },
  { id: 4,  name: "Chicken Biryani",      category: "meals",     price: 220, veg: false, rating: 4.8, spice: { level: 2 }, badge: "Bestseller", inStock: true },
  { id: 5,  name: "South Indian Meals",   category: "meals",     price: 150, veg: true,  rating: 4.3, spice: { level: 1 }, inStock: true },
  { id: 6,  name: "Paneer Butter Masala", category: "meals",     price: 180, veg: true,  rating: 4.5, spice: { level: 1 }, badge: "New", inStock: true },
  { id: 7,  name: "Fish Curry Meals",     category: "meals",     price: 240, veg: false, rating: 4.4, spice: { level: 3 }, inStock: false },
  { id: 8,  name: "Samosa (2 pcs)",       category: "snacks",    price: 40,  veg: true,  rating: 4.1, spice: { level: 1 }, inStock: true },
  { id: 9,  name: "Chicken 65",           category: "snacks",    price: 160, veg: false, rating: 4.7, spice: { level: 3 }, inStock: true },
  { id: 10, name: "Filter Coffee",        category: "drinks",    price: 30,  veg: true,  rating: 4.9, badge: "Bestseller", inStock: true },
  { id: 11, name: "Masala Chai",          category: "drinks",    price: 25,  veg: true,  rating: 4.6, inStock: true },
  { id: 12, name: "Fresh Lime Soda",      category: "drinks",    price: 50,  veg: true,  rating: 4.0, inStock: false }
];

export const coupons = {
  TIFFIN10: { type: "percent", value: 10, max: 100, minOrder: 0 },
  FIRST50:  { type: "flat",    value: 50, minOrder: 300 }
};

export default menu;
