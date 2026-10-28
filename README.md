# Tiffin Tales

An online food-ordering website for a South Indian café in Coimbatore, built with plain HTML, CSS and JavaScript (ES modules). No frameworks, no build step.

> This is a front-end demo. It does not take real payments, notify a restaurant or deliver food.

**Live site:** _add your URL here after you deploy and open it yourself_
**Repository:** _add your GitHub URL here after you push_

## Features
- 12 dishes rendered from `menu.js` (veg / non-veg mark, rating, spice level, badges, sold-out state)
- Live search, category chips, veg-only switch and sorting (price low/high, top rated)
- Cart with + / − buttons; an item is removed when its quantity reaches 0
- Bill: subtotal, discount, 5% GST, ₹40 delivery (free when the amount after discount is ₹499 or more) and total
- Coupons: `TIFFIN10` (10% off, max ₹100) and `FIRST50` (₹50 off orders of ₹300 or more)
- Checkout form with field-level validation and an order confirmation popup (order ID like `TT-RK-0007`)
- Responsive layout for phone, tablet and desktop

## Folder structure
```
tiffin-tales/
├── index.html    page structure
├── style.css     design and responsive layout
├── menu.js       the 12 dishes and the coupons
├── utils.js      pure functions: price, discount, bill, validation, order ID
├── app.js        state, rendering and events
├── package.json  project info (no dependencies)
└── README.md
```

## Run it on your computer
ES modules do not work when you double-click `index.html`. Use a local server:
- VS Code: install **Live Server**, right-click `index.html` → *Open with Live Server*, or
- Terminal: `python3 -m http.server 8000` then open http://localhost:8000

## Deploy
It is a static site: no build command and no output folder setting is needed.
- **Vercel:** import the GitHub repo, Framework Preset = *Other*, leave Build Command and Output Directory empty.
- **GitHub Pages:** Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

## What I learned
_Write 3 to 5 lines in your own words._
