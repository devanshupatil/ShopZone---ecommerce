# Online Store Homepage — Design Spec
**Date:** 2026-04-13  
**Status:** Approved  

---

## 1. Project Overview

A responsive, single-page online store homepage named **ShopZone** built with Vanilla HTML5 + Tailwind CSS (CDN) + plain JavaScript. Product data loaded from a JSON file. No build step — opens directly in browser.

**Evaluation weight:** Design (25%) · Functionality (25%) · Code Quality (20%) · GitHub (15%) · Demo (15%)

---

## 2. File Structure

```
Online Store Homepage/
├── index.html                  # Main homepage
├── css/
│   └── style.css               # Custom animations & overrides only
├── js/
│   └── app.js                  # Filters, sorting, slider, cart, search
├── data/
│   └── products.json           # 16 products (4 per category)
└── README.md                   # Project overview, instructions, tech stack
```

---

## 3. Design System (from Stitch — "Elegant Dark Glass")

### Fonts
- **Headings / Brand**: Plus Jakarta Sans (400–800)
- **Body**: Inter (400–600)
- **Icons**: Material Symbols Outlined (Google Fonts)

### CDN Dependencies (index.html `<head>`)
```html
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

### Tailwind Color Tokens (extend in tailwind.config)
| Token | Hex |
|---|---|
| `surface` | `#10131a` |
| `on-surface` | `#e1e2ec` |
| `primary` | `#ff5e00` (orange) |
| `primary-container` | `#5a1c00` |
| `on-primary-container` | `#531900` |
| `surface-container-lowest` | `#0d1017` |
| `surface-container-low` | `#1a1d26` |
| `surface-container-high` | `#32353d` |
| `surface-container-highest` | `#3d4049` |
| `on-surface-variant` | `#c4c6d0` |
| `outline-variant` | `#5b4137` |
| `surface-variant` | `#4a4458` |

### Custom CSS Classes (style.css)
```css
.ghost-border { border: 1px solid rgba(91, 65, 55, 0.15); }
.orange-glow-hover:hover { box-shadow: 0 0 30px rgba(255, 94, 0, 0.15); }
.glass-panel { background: rgba(50,53,61,0.4); backdrop-filter: blur(12px); }
```

### Body Base
```html
<body class="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
```

---

## 4. Page Sections

### 4.1 Navbar (fixed, glassmorphism)
- Class: `fixed top-0 w-full z-50 bg-[#10131a]/60 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(255,94,0,0.15)]`
- Left: **ShopZone** logo (Plus Jakarta Sans, orange gradient text)
- Center: Search input (`bg-surface-container-lowest rounded-xl`) with search icon
- Right: Wishlist icon button + Cart button with item badge count

### 4.2 Hero Banner / Slider
- 3 slides, auto-rotates every 4s, manual dot navigation
- Each slide: sale badge pill · bold headline · subtext · two CTA buttons (primary filled + ghost outline)
- Right side: floating product card (glass-panel, ghost-border, orange-glow-hover)
- Orange radial glow background effect
- Slide dot indicators at bottom center

### 4.3 Category Tabs
- Tabs: All Products · Electronics · Fashion · Home Appliances · Books
- Tab-to-JSON category mapping: `all` → show all · `Electronics` → `"electronics"` · `Fashion` → `"fashion"` · `Home Appliances` → `"home"` · `Books` → `"books"`
- Active state: orange underline + orange text
- Click filters the product grid instantly (no reload)

### 4.4 Filter Bar (below category tabs)
- All prices are in **INR (Indian Rupee ₹)**. Product prices in `products.json` are stored as plain integers in paise-free rupees (e.g. `134900` = ₹1,34,900).
- **Price chips**: All · Under ₹500 · ₹500–₹2,000 · ₹2,000–₹10,000 · ₹10,000+
- **Rating chips**: 4★ & above · 3★ & above
- Active chip: `bg-primary/15 border-primary text-primary`
- **Results count**: "Showing N products" (updates live)
- **Sort dropdown** (right-aligned): Featured · Price: Low to High · Price: High to Low · Rating: High to Low

### 4.5 Product Grid
- Desktop: 4 columns · Tablet: 2 columns · Mobile: 1 column
- Each **product card**:
  - Image area (dark gradient bg + emoji/icon, 160px tall)
  - Badge top-left: HOT (orange) / NEW (green) / SALE (red) — from JSON data
  - Wishlist ♡ button top-right (toggles filled/outlined)
  - Category label (uppercase, muted, 10px)
  - Product name (bold, white)
  - Price row: orange price · strikethrough original · green discount %
  - Star rating + review count
  - "Add to Cart" button (orange gradient, full width)
  - Hover: `-translate-y-2 orange-glow-hover` transition

### 4.6 Footer
- Dark bg, top border
- Logo left · Nav links center (About · Privacy · Terms · Contact) · Copyright right

---

## 5. Data — products.json

16 products, 4 per category. Each product object:
```json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "category": "electronics",
  "price": 134900,
  "originalPrice": 159900,
  "rating": 4.8,
  "reviews": 2341,
  "badge": "HOT",
  "emoji": "📱"
}
```
Categories: `electronics` · `fashion` · `home` · `books`

---

## 6. JavaScript (app.js) — Feature Map

| Feature | Behaviour |
|---|---|
| Load products | `fetch('data/products.json')` on DOMContentLoaded, render all cards |
| Category filter | Click tab → filter array by category, re-render grid |
| Price filter | Click chip → filter by price range |
| Rating filter | Click chip → filter by `rating >= N` |
| Sort | Dropdown change → sort filtered array, re-render |
| Search | Input event → filter by name match (case-insensitive) |
| All filters combined | Single `applyFilters()` function reads all active state |
| Hero slider | `setInterval` 4000ms auto-advance, dot click manual |
| Add to Cart | Increment cart count badge in navbar, store in `localStorage` |
| Wishlist | Toggle heart icon per product, persist in `localStorage` |

---

## 7. Responsive Breakpoints

| Breakpoint | Grid | Navbar |
|---|---|---|
| Mobile (`< 640px`) | 1 col | Search hidden, icon only |
| Tablet (`640–1024px`) | 2 cols | Search visible |
| Desktop (`> 1024px`) | 4 cols | Full navbar |

---

## 8. Out of Scope

- Backend / real API
- User authentication
- Payment processing
- React / build tooling
