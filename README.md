# Pooja Boutique and Matching Centre - Full-Stack Website & Admin System

A commercial-grade full-stack web application and administration system for **Pooja Boutique and Matching Centre**, a premier clothes and fabric wholesaler located in Hyderabad, Telangana.

---

## 🏬 Business Overview

- **Business Name:** Pooja Boutique and Matching Centre
- **Type:** Clothes & Fabric Wholesaler / Retailer
- **Address:** GS9, 4-100, Buddha Nagar Colony, Mallikarjuna Nagar, Buddha Nagar, Hyderabad, Telangana – 500092
- **Phone:** 088859 13999
- **WhatsApp:** 918885913999

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS (Luxury Palette: Royal Maroon `#7A1C30`, Royal Gold `#D4AF37`, Cream `#FFF9F3`)
- **Icons:** Lucide React
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** SQLite (with promiscuous async helpers and production SQL schema compatible with PostgreSQL/MySQL)
- **Security:** Bcryptjs password hashing, JWT authentication, Helmet HTTP headers, CORS, express-rate-limit
- **Uploads:** Image static serving & multer upload support

---

## 🔑 Initial Admin & Demo Accounts

### Administrator Account
- **URL:** `/admin/login`
- **Email:** `admin@poojaboutique.com`
- **Password:** `AdminPooja2026!`

### Sample Customer Account
- **URL:** `/login`
- **Email:** `customer@gmail.com`
- **Password:** `Password123!`

---

## 🚀 Quick Start Guide

### 1. Installation

Ensure Node.js is installed on your system.

```bash
# Clone or navigate to the project directory
cd pooja-boutique

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

The backend relies on `backend/.env`:

```env
PORT=5000
JWT_SECRET=pooja_boutique_secret_jwt_key_2026_hyderabad_wholesaler
NODE_ENV=development
ADMIN_INIT_EMAIL=admin@poojaboutique.com
ADMIN_INIT_PASSWORD=AdminPooja2026!
```

### 3. Database Initialization & Seeding

The SQLite database seeds automatically on server startup. You can manually re-seed using:

```bash
cd backend
npm run seed
```

### 4. Running Locally

Start the Backend REST API server (Port 5000):

```bash
cd backend
npm start
```

Start the Frontend Vite Dev Server (Port 3000):

```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🔒 Security Features

1. **Password Safety:** All passwords are stored as `bcrypt` salted hashes. Plain text passwords are never stored.
2. **Password Reset Workflow:** Single-use, cryptographically generated tokens with 30-minute expiration. Tokens are stored as SHA-256 hashes in `password_reset_tokens`.
3. **Role-Based Authorization:** Middleware enforces `admin` permissions on `/api/products` POST/PUT/DELETE, `/api/categories`, `/api/inquiries`, and `/api/settings`.
4. **Rate Limiting:** Protects `/api/auth/forgot-password` against brute-force and email harvesting attacks.

---

## 📱 Features Included

- **Sticky Navigation & Hamburger Menu:** Clean luxury header with search modal, wishlist drawer, and inquiry cart drawer.
- **Product Catalog Filtering:** Filter products by Category, Fabric type (Cotton, Silk, Georgette, etc.), Color, Price sorting, and keyword search.
- **Direct WhatsApp Inquiry:** Dynamic link generation with pre-populated product names (`Hello, I am interested in [Product Name]...`).
- **Product Detail Modal:** Image previews, fabric specifications, stock count, wishlist toggle, and form inquiry modal.
- **Store Location & Google Maps:** Integrated address, business hours, phone call button, and interactive map embed.
- **Admin Dashboard:** Complete overview statistics, Product CRUD, Category CRUD, Inquiry status tracking (`new` -> `contacted` -> `completed`), Gallery management, Offer promotions management, and Store settings editor.
