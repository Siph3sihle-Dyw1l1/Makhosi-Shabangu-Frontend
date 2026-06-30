# Makhosi Shabangu — Traditional Healing & Wellness

**Live site:** [PASTE LINK HERE]

![Landing page preview](images\landing_page.png)

## About

A front-end showcase website for a traditional healing and wellness
practice. The site covers a home page with about, services, testimonials,
and a booking section, a shop page with a working cart, and a full demo
checkout flow — all built with plain HTML, CSS, and JavaScript.

It's designed to look and feel like a real e-commerce experience while
being entirely front-end: no backend, no database, and no server-side code.
Cart contents persist locally in the browser, and checkout walks through a
realistic review → payment → confirmation flow using a simulated card form
and a WhatsApp-based order confirmation step.

## Features

- Single-page home with hero, about, services, testimonials, and booking
- Shop page with product grid, filtering, and a persistent cart
- Three-step demo checkout (review, payment, confirmation)
- WhatsApp integration for sending booking and order details
- No build tools or dependencies — just static HTML/CSS/JS

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

## Tech

- HTML5, CSS3, vanilla JavaScript
- No frameworks, no build step
- Cart state persisted via `localStorage`

## Status

Front-end demo. Real payment processing, order storage, and automated
WhatsApp messaging are planned backend additions and are not part of this
build.
