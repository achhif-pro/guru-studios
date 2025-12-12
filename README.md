# EKBAL STUDIO — Premium Software & Services 🌟

Welcome to EKBAL STUDIO — your premium hub for software, operating systems, utilities, and professional digital services.
This static demo e-commerce website is built with HTML, CSS and vanilla JavaScript, designed to be mobile-first and highly interactive.

---

🎯 Highlights

-   Brand: EKBAL STUDIO (replaced earlier "Guru Studios")
-   Red theme, animated background, and an interactive mouse-tracking 3D bubble cursor animation
-   32 digital product items with product cards, product details, shopping cart (localStorage), and checkout instructions
-   30% promotional discount popup (code: `EKBAL30`) shows on first visit; there is also a "30% OFF — Claim" banner in the navbar to quickly claim the coupon
-   Coupon support: apply coupon in cart (applies 30% discount)

---

⚙️ Run locally

1. Clone repository

```
git clone <your-repo-url>
cd guru-studios
```

2. Start a simple HTTP server in the root of the project (or use your preferred dev server):

For Python 3:

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

For Node (using serve):

```bash
npm install -g serve
serve . -l 8000
```

---

📁 Project structure (visual) 🎨

```
EKBAL-STUDIO/
├─ index.html                  # Main page, sections, modals, and content
├─ README.md                   # This README (you're viewing it)
├─ css/
│  └─ style.css                # Styling, theme, responsive rules and animations
├─ js/
│  ├─ products.js              # Products data array (id/name/price/image/features)
│  ├─ script.js                # Main interactive logic (rendering, modal, cart, coupon)
│  └─ mouse-tracker.js         # Mouse bubble animation rendering on canvas
├─ assets/
│  ├─ images/
│  │  ├─ favicon.svg           # Favicon & cursor image
│  │  ├─ Social Media Profile.svg
│  │  ├─ Professional Gmail.svg
│  │  └─ ... (other SVG/PNGs)
└─ UPDATES.md                  # Changelog and recent updates
```

---

💡 Quick walkthrough

-   index.html

    -   Navbar: search + suggestions + cart icon
    -   Hero: animated background and CTA
    -   Shop: displays cards from `js/products.js`
    -   Product modal: `Buy Now` opens modal with details and terms checkbox
    -   Cart: users can add & remove items, apply coupons, and checkout via external channels (Google Form / Discord / WhatsApp)

-   Features implemented with code pointers:
    -   Search: `js/script.js` → `performSearch()` and `showSearchSuggestions()`
    -   Cart persistence: `saveCartToStorage()` & `loadCartFromStorage()`
    -   Coupon: `applyCoupon(code)` applies `EKBAL30` / `DISCOUNT30` for a 30% discount
    -   Discount popup: `index.html` contains `#discountModal` → shown once per user (localStorage flag `seenDiscountPopup`)
    -   Mouse bubbles: `js/mouse-tracker.js` uses canvas and physics simulation for click & move animation

---

🛠️ Where to change things

-   To add or edit products: modify `js/products.js` and place product images under `assets/images/`
-   Change default coupon codes: modify `applyCoupon(code)` function in `js/script.js`
-   To change the popup promo text and discount, edit `index.html` and `js/script.js`

---

🎨 Accessibility & UX Tips

-   The site uses high-contrast red theme; review color contrast for optimal readability
-   Terms & Conditions checkbox is required before adding products; the checkout flow is intentionally external (Google Form / Discord / WhatsApp) — consider adding a payment gateway for real transactions

---

🚀 Deployment notes (beginner to advanced)

-   Beginner: Use GitHub Pages (static site)

    -   Push code to `gh-pages` branch or set `main` branch to GitHub Pages in repo settings

-   Intermediate: Use Netlify / Vercel

    -   Connect your repo, set root to folder, and deploy automatically

-   Advanced: Add a backend (optional)
    -   Use Node/Express or serverless functions to accept orders
    -   Integrate payment provider (Stripe / PayPal)
    -   Validate coupon server-side for fraud prevention

---

📦 Final notes and next steps

-   This repository is a fully static demo that showcases UI & UX for an e-commerce-like digital products site. For production, you should:
    1.  Integrate a secure payment processor
    2.  Move to server-side product management and order handling
    3.  Add secure licensing and delivery for paid digital items

Enjoy using EKBAL STUDIO! 🎉

If you want me to provide README images, GIF walkthroughs, or to add production build scripts, I can do that next.
