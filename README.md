# 🌿 ManaDeshi Dukaan by Swathi — Organic & Natural Foods E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v23+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-v4-black.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v18-336791.svg)](https://www.postgresql.org/)
[![Rating](https://img.shields.io/badge/Google_Maps-5.0_★_(100+_Reviews)-f59e0b.svg)](https://maps.google.com/?q=ManaDeshi+Dukaan+by+Swathi+Manikonda+Hyderabad)

> **Switch to a Healthier Lifestyle with Our Natural and Organic Products.**  
> Authentic Andhra pickles, stone-ground podis, wood-pressed oils, bilona A2 Gir cow ghee, Andhra sweets, and organic millets handcrafted with heirloom family recipes in **Manikonda, Hyderabad**.

---

## 🏪 Business Profile & Heritage

- **Store Name:** ManaDeshi Dukaan by Swathi
- **Physical Address:** Sai Srinivasa Nilayam, Flat # T4, Srinivasa Colony, Manikonda, Lane beside Pizza Hut & Harivillu Apartments, Hyderabad-500089, Telangana
- **Contact / WhatsApp:** [+91 9951118687](https://wa.me/919951118687)
- **FSSAI License:** `23621028000492`
- **Store Hours:** Monday – Sunday: 9:00 AM – 9:00 PM
- **Local Delivery:** Express 1–2 Hours in Manikonda & Puppalguda | 2–4 Hours across Western Hyderabad (Gachibowli, Kondapur, Madhapur, Jubilee Hills) | Pan-India 3–5 Days

---

## 🏗️ Architecture & Technology Stack

```
manadeshi dukhaan/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── public/
│   │   └── visiting_card.png     # Authentic physical store visiting card & logo
│   ├── src/
│   │   ├── components/           # Navbar, HeroSection, ProductCard, CartDrawer,
│   │   │                         # ProductDetailModal, CheckoutModal, OrderTrackingModal,
│   │   │                         # AdminDashboard, VisitingCardModal, PincodeModal,
│   │   │                         # WhatsAppFloatingWidget, Footer
│   │   ├── context/              # CartContext (persisted), WishlistContext (persisted)
│   │   ├── services/             # api.ts (backend client & proxy)
│   │   ├── data/                 # mockData.ts (zero-setup fallback catalog)
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── index.css             # Tailwind v4 styles, typography & design tokens
│   │   ├── App.tsx               # Main application controller
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts            # Configured with proxy to port 5000
│
├── backend/                      # Node.js + Express + PostgreSQL (raw SQL)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # PostgreSQL connection pool with auto-fallback
│   │   ├── db/
│   │   │   ├── schema.sql        # 12+ PostgreSQL DDL tables with relations & indexes
│   │   │   └── seed.js           # Catalog seed data with 12 authentic products & variants
│   │   ├── controllers/          # Products, Categories, Orders, Coupons, Pincodes, Admin
│   │   ├── routes/               # RESTful API route definitions
│   │   └── server.js             # Express API entry point on port 5000
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── package.json                  # Root runner script
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(Or install individually inside `/backend` and `/frontend` using `npm install`)*

### 2. Start Backend API
```bash
npm run dev:backend
```
- Server starts at: **`http://localhost:5000`**
- API Health Check: `http://localhost:5000/api/health`
- Products Catalog: `http://localhost:5000/api/products`

### 3. Start Frontend Storefront
In another terminal, run:
```bash
npm run dev:frontend
```
- Storefront opens at: **`http://localhost:3000`**

---

## 🗄️ PostgreSQL Database Setup

The backend is built with **Node.js + PostgreSQL** using native raw SQL queries.

### Dual-Mode Database Engine:
1. **PostgreSQL Mode:** If PostgreSQL is configured, the backend automatically connects via `pg.Pool`, executes `schema.sql`, and seeds all authentic categories, products, variants, delivery pincodes, and initial orders.
2. **Zero-Friction Fallback Mode:** If your local PostgreSQL password or user isn't configured yet, the backend automatically activates an in-memory/JSON store with full CRUD support so you can immediately demo, add items to cart, place orders, and manage products without setup friction!

### Configuring Your PostgreSQL:
Edit `backend/.env`:
```env
PORT=5000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_actual_postgres_password
PGDATABASE=manadeshi_dukaan
```
To run the raw SQL schema manually:
```bash
psql -U postgres -d manadeshi_dukaan -f backend/src/db/schema.sql
```

---

## 🛒 Key Features Built

### 1. Customer Storefront
- **Visual Branding & Theme:** Earthy olive green (`#1E3A27`), warm clay terracotta (`#B35427`), golden mustard (`#D97706`), and heritage cream (`#FAF7F2`) with Playfair Display and Plus Jakarta Sans typography.
- **Top Announcement Bar:** Same-day delivery notification for Manikonda & Hyderabad within 2-4 hours.
- **Live Search with Dropdown Overlay:** Real-time search with thumbnail previews, prices, and categories.
- **Hyderabad Delivery Checker:** Enter any 6-digit pincode (e.g., `500089` for Manikonda, `500032` for Gachibowli, `500081` for Madhapur) to get instant delivery speeds and fees.
- **Product Variants (First-Class Feature):** Switch between **250g, 500g, 1kg, 1L** weights with instant price recalculations directly on product cards or the detail modal.
- **Rich Product Details:** Ingredients, Ayurvedic health benefits, serving instructions, storage & shelf-life tabs, and verified buyer reviews.
- **Cart Slide-Over Drawer:** Real-time free delivery milestone progress bar, item quantity adjustments, and coupon code discounts (`MANADESHI10`, `SWATHI50`).
- **Complete Checkout Flow:** Delivery address form with quick Hyderabad presets, payment selection (UPI / Razorpay simulation / COD / WhatsApp confirmation).
- **Live Order Status Tracker:** 5-step status timeline (`Placed -> Confirmed -> Packed -> Shipped -> Delivered`), itemized invoice, and printable receipt.
- **WhatsApp Ordering Widget:** Floating quick-chat badge connected to `+91 9951118687` with prefilled product and cart messages.
- **Store Visiting Card Modal:** Displays the authentic business card image and exact Manikonda address.

### 2. Admin Management Panel (`/admin` or top toggle)
- **Dashboard KPIs:** Total Revenue (₹84,500), Total Orders (128), Active Customers (94), Catalog Products (67+).
- **Today's Orders Breakdown:** Live status counts for Pending, Confirmed, Packed, Shipped, and Delivered.
- **Orders Pipeline Manager:** Filter by status, inspect customer address and phone, and change order status in 1 click.
- **Product & Variant Catalog:** Add new organic products with multiple weight/size variants, edit prices, toggle bestsellers, or delete products.
- **Hyderabad Delivery Zones:** Manage express delivery pincodes and free shipping thresholds.
- **Coupons & Promotions:** Inspect and manage discount codes.

---

## 📡 RESTful API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server status and database mode |
| `GET` | `/api/products` | Catalog listing with search, category, sort, and tag filters |
| `GET` | `/api/products/:identifier` | Single product by ID or slug with variants and related items |
| `POST` | `/api/products` | Admin: Create new product with variants |
| `PUT` | `/api/products/:id` | Admin: Update product details |
| `DELETE` | `/api/products/:id` | Admin: Delete product |
| `GET` | `/api/categories` | Categories list with product counts |
| `POST` | `/api/orders` | Create customer order with items and address |
| `GET` | `/api/orders/:identifier` | Fetch order by order number (e.g. `MD-89241`) for live tracking |
| `GET` | `/api/orders` | List orders with status filtering |
| `PATCH` | `/api/orders/:id/status` | Admin: Update order status (`Confirmed`, `Packed`, `Shipped`, etc.) |
| `GET` | `/api/coupons/validate` | Validate coupon code against order subtotal |
| `GET` | `/api/coupons` | List active coupons |
| `GET` | `/api/pincodes/check/:pincode` | Check Hyderabad local delivery speed and fee |
| `GET` | `/api/admin/stats` | Admin KPI metrics and recent orders |

---

## 🌿 Authentic Catalog Highlights Included

1. **Pickles (పచ్చళ్ళు):** Kothimera Karam (కొత్తిమీర కారం), Traditional Andhra Avakaya (ఆవకాయ), Guntur Gongura Pachadi (గోంగూర)
2. **Podis & Powders:** Karivepaku Podi (కరివేపాకు పొడి), Kandi Podi, Idli Karam Podi
3. **Cold-Pressed Oils:** Wood-Pressed Groundnut Oil (వేరుశెనగ నూనె), Cold-Pressed Sesame Oil, Coconut Oil
4. **Pure Ghee & Honey:** Vedic A2 Gir Cow Bilona Cultured Ghee (దేశీ ఆవు నెయ్యి), Raw Wild Forest Honey
5. **Traditional Snacks:** Butter Murukku / Chakralu (వెన్న జంతికలు), Chekodilu, Vadiyalu
6. **Andhra Sweets:** Bellam Sunnundalu (బెల్లం సున్నుండలు), Atreyapuram Bellam Pootharekulu (పూతరేకులు)
7. **Millets & Grains:** Organic Foxtail Millet (కొర్రలు - Unpolished), Little Millet, Barnyard Millet
8. **Gift Hampers:** ManaDeshi Royal Heritage Gift Box (రాయల్ కానుక పెట్టె)
