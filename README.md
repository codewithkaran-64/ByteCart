# 🛒 ByteCart — Full Stack E-Commerce Website

A full-stack e-commerce website built with **Node.js, Express, MongoDB (Mongoose)**, plain **HTML/CSS/JavaScript**, and **Stripe** for real checkout. Includes user signup/login, 40 sample products across 8 categories, category filtering, search, an animated shopping cart, and a working Stripe test-mode payment flow.

---

## ✨ Features

- User **Sign Up** and **Login** with live field validation, a password strength meter, and a show/hide password toggle (passwords hashed with bcrypt, sessions via JWT in an httpOnly cookie)
- 40 sample products across 8 categories — every photo is a real, individually verified Unsplash photo matching that product
- Category filter + product search
- **Interactive UI**: 3D tilt effect on product cards (follows your cursor), a parallax hero banner, scroll-reveal animations as products come into view, and a "fly to cart" animation when you add an item
- **Slide-out cart drawer** with animated quantity controls, and the cart is saved in the browser so it survives a page refresh
- Toast notifications instead of browser `alert()` popups
- **Real checkout with Stripe** (test mode) — clicking "Checkout" creates a Stripe Checkout Session and redirects to Stripe's hosted payment page; on success you land on an animated confirmation page showing your order
- Orders are saved in MongoDB against the logged-in user, with payment status tracked
- Fully responsive, plain HTML/CSS/JS frontend (no framework/build step needed)

## 🧰 Tech Stack

| Layer     | Technology                              |
|-----------|------------------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JavaScript          |
| Backend   | Node.js, Express                         |
| Database  | MongoDB with Mongoose                    |
| Auth      | JWT (httpOnly cookie) + bcryptjs         |
| Payments  | Stripe Checkout (test mode)              |

---

## 📁 Project Structure

```
ByteCart/
├── database/
│   └── db.js                # MongoDB connection (Mongoose)
├── middleware/
│   └── auth.js               # JWT auth middleware
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js               # includes Stripe payment status
├── seed/
│   ├── products.js           # 40 sample products data (real verified photos)
│   └── seed.js                # Script to insert products into MongoDB
├── public/                   # Frontend (served as static files)
│   ├── index.html             # Home page (hero, products, cart drawer)
│   ├── login.html
│   ├── register.html
│   ├── success.html            # Stripe payment success page
│   ├── cancel.html             # Stripe payment cancelled page
│   ├── style.css               # Main site styling + animations
│   ├── login.css               # Auth page styling
│   ├── result-page.css         # Success/cancel page styling
│   ├── script.js                # All storefront interactivity
│   └── auth.js                  # Login/register logic + validation
├── server.js                  # Express app + all API routes + Stripe
├── package.json
├── .env.example                # Copy to .env and fill in your values
└── .gitignore
```

---

## 🚀 Running on localhost

### 1. Install prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- MongoDB — either:
  - **Local MongoDB**: install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and make sure it's running (`mongod`), **or**
  - **MongoDB Atlas** (free cloud database): create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas) and copy its connection string.
- A free [Stripe account](https://dashboard.stripe.com/register) (for test-mode payments — no real card ever gets charged)

### 2. Install dependencies

```bash
cd ByteCart
npm install
```

### 3. Get your Stripe test keys

1. Sign up / log in at [dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure the dashboard is in **Test mode** (toggle in the top right)
3. Go to **Developers → API keys**
4. Copy the **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`)

### 4. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
MONGODB_URI=mongodb://127.0.0.1:27017/bytecart
JWT_SECRET=any-long-random-string
PORT=3000
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
CLIENT_URL=http://localhost:3000
```

If you're using MongoDB Atlas instead of a local database, replace `MONGODB_URI` with your Atlas connection string.

### 5. Seed the database with 40 sample products

```bash
npm run seed
```

This only inserts products the first time — safe to leave in your workflow. To reset the catalog, drop the `products` collection and run it again.

### 6. Start the server

```bash
npm start
```

Visit **http://localhost:3000** in your browser. 🎉

For auto-restart on file changes during development, use `npm run dev`.

---

## 💳 Testing the payment flow

Add items to your cart, click **Checkout with Stripe**, and on Stripe's hosted payment page use one of Stripe's official test cards — nothing is ever actually charged in test mode:

| Card number           | Result            |
|------------------------|--------------------|
| `4242 4242 4242 4242`  | Payment succeeds   |
| `4000 0000 0000 9995`  | Payment is declined |

Use any future expiry date, any 3-digit CVC, and any postal code. After a successful test payment, Stripe redirects you back to `success.html`, which confirms the payment and shows your order summary.

**Note on webhooks:** production Stripe integrations typically use webhooks to confirm payment server-side. This project instead verifies the payment status directly when `success.html` loads (`GET /api/checkout-session/:sessionId`), which is simpler to run locally since it doesn't require exposing your dev server to the internet. If you deploy this for real, consider adding a webhook handler as a more robust confirmation path.

---

## 🔑 API Overview

| Method | Route                          | Description                                | Auth required |
|--------|----------------------------------|----------------------------------------------|----------------|
| POST   | `/api/register`                 | Create a new account                          | No             |
| POST   | `/api/login`                     | Login, sets JWT cookie                        | No             |
| POST   | `/api/logout`                    | Logout, clears cookie                         | No             |
| GET    | `/api/user`                       | Get currently logged-in user                  | No (401 if not logged in) |
| GET    | `/api/products`                   | List products (`?category=`, `?search=`)      | No             |
| GET    | `/api/categories`                 | List all categories                           | No             |
| POST   | `/api/create-checkout-session`   | Create a Stripe Checkout session for the cart | Yes            |
| GET    | `/api/checkout-session/:id`       | Verify a completed Stripe session, save order | Yes            |
| GET    | `/api/orders`                     | Get the logged-in user's past orders          | Yes            |

---

## ☁️ Uploading to GitHub

```bash
cd ByteCart
git init
git add .
git commit -m "Initial commit - ByteCart e-commerce project"
git branch -M main
git remote add origin https://github.com/codewithkaran-64/YOUR-REPO-NAME.git
git push -u origin main
```

**Important:** `.env` is already excluded via `.gitignore`, so your database credentials, JWT secret, and **Stripe keys** will never be pushed to GitHub. Only `.env.example` (with placeholder values) gets committed. `node_modules/` is excluded too — anyone cloning the repo just runs `npm install`.

---

## 🖼️ About the product images

Every product photo is a real, individually verified image hosted on Unsplash's CDN (`images.unsplash.com`) — matched to what the product actually is. These are permanent CDN links, not a random-image or rate-limited proxy service. Swap the `image` field in `seed/products.js` with your own product photos any time.

## 🎨 About the animations

- **Tilt effect**: each product card listens for `mousemove` and rotates slightly in 3D based on cursor position (`public/script.js`, `attachTiltEffect()`)
- **Scroll reveal**: an `IntersectionObserver` adds a `.revealed` class to cards as they scroll into view, triggering a fade/slide-in animation
- **Fly-to-cart**: clicking "Add to Cart" clones the product image and animates it flying to the cart icon before the cart badge bumps
- **Parallax hero**: the hero banner's background layers shift slightly opposite to your mouse movement for a subtle depth effect

All of this is vanilla CSS/JS — no animation library required, so there's nothing extra to install.

## 🔒 Notes on security

- Passwords are hashed with bcrypt before being stored — plain-text passwords are never saved.
- Login sessions use a JWT stored in an **httpOnly** cookie, so it can't be read by client-side JavaScript.
- Product prices are always re-fetched from MongoDB when creating a Stripe session — the cart in the browser is never trusted for pricing.
- Before deploying to production: change `JWT_SECRET` to a strong random value, set `cookie.secure: true` in `server.js` once you're serving over HTTPS, and switch your Stripe keys from test mode to live mode.

## 📌 Possible next steps

- Add an admin page to add/edit/delete products from the UI instead of `seed/products.js`
- Add an order-history page on the frontend using the existing `GET /api/orders` route
- Add a Stripe webhook handler for production-grade payment confirmation
- Add product detail pages
- Deploy the backend (Render/Railway) and connect it to MongoDB Atlas + live Stripe keys for a real demo link
"# ByteCart" 
