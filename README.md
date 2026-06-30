# Makhosi Shabangu — Traditional Healing & Wellness

A front-end-only website: home/about/services/booking on one page, a shop
page with a working cart, and a demo checkout flow. No backend, no
database, no server-side code anywhere in this repo. Built as a showcase
piece — a real payment gateway, real order storage, and automated WhatsApp
sending are backend work to be added later, not part of this build.

## How checkout currently works (demo only)

1. Visitors add products to a cart (stored in the browser via
   `localStorage`, so it survives a refresh but is private to that one
   browser/device).
2. Checkout → `checkout.html`: Review step shows the order and total.
3. Payment step is a **demo card form** — format-only checks (16 digits,
   MM/YY, 3-digit CVV), a simulated ~1.4s "processing" delay, no network
   call, nothing stored or transmitted. A persistent "Demo checkout — no
   real charge will be made" badge stays visible through the flow.
4. Confirmation step shows a generated order ID and a button that opens a
   pre-filled WhatsApp chat **to your business number** with the order
   summary — the customer taps send. A static site can't auto-message a
   customer's own WhatsApp without a backend/paid API, so this is the
   honest front-end-only version of "send a confirmation."

When the real payment gateway is added later, `js/checkout.js` is the only
file that needs real logic swapped in — the review/confirmation UI and the
WhatsApp step can stay as-is.

## Project structure

```
makhosi-shabangu/
├── index.html              Home page (hero, about, services, testimonials, booking form)
├── products.html            Shop page (product grid, filters, cart)
├── checkout.html             Demo checkout: review → payment → confirmation
├── css/
│   └── style.css            All styles — single stylesheet, design tokens at the top
├── js/
│   ├── cart.js                Product data + cart logic (localStorage, cart drawer)
│   ├── checkout.js            Checkout stepper, demo card form, fake "payment", WhatsApp confirmation
│   └── main.js                 Nav toggle, footer year, booking form → WhatsApp
├── images/
│   ├── hero.svg               PLACEHOLDER — replace, see images/IMAGES.md
│   ├── about-portrait.svg     PLACEHOLDER — replace
│   ├── product-*.svg          PLACEHOLDER — replace, one per product
│   └── IMAGES.md              Exactly what to shoot/source for each slot
└── README.md                 This file
```

## Editing product info

All product names, prices, descriptions, and categories live in one place:
`js/cart.js`, in the `PRODUCTS` array near the top. Edit that array — both
the shop page and the checkout review step re-render from it automatically.

Before launch, also update:
- `WHATSAPP_NUMBER` at the top of `js/cart.js` (used on checkout confirmation
  and in the booking form)
- The WhatsApp links in `index.html` (`wa.me/27000000000` appears twice)
- Real opening hours / location text in the contact section of `index.html`

## Replacing the placeholder images

See `images/IMAGES.md` for the exact dimensions and content guidance for
every slot.

## When the real payment gateway gets added

This demo intentionally keeps payment logic isolated in `js/checkout.js`
so swapping it later is contained:
- The card form fields and the "Pay" button submit handler are where a real
  gateway SDK (Yoco, PayFast, Paystack) would be wired in — that requires a
  backend endpoint to create the charge, which doesn't exist yet by design.
- Order IDs, cart contents, and totals are already structured as a clean
  object (`checkoutSnapshot`) — a real backend can consume that same shape.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `makhosi-shabangu-website`).
2. Push this whole folder to it:
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source** → select
   `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
4. GitHub gives you a live URL within a minute or two, typically
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`.
5. Because `index.html` sits at the repo root, no extra config is needed —
   Pages will find it automatically.

No build step, no `npm install`, nothing to compile — it's plain HTML/CSS/JS,
so what you push is exactly what goes live.