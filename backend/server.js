const express = require('express');
const cors = require('cors');
const { initDB, seedProducts } = require('./db/setup');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Database ───
const db = initDB();
seedProducts(db);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Helper: parse JSON fields from DB row
function parseProduct(row) {
    if (!row) return null;
    return {
        ...row,
        colors: row.colors ? JSON.parse(row.colors) : null,
        storage_options: row.storage_options ? JSON.parse(row.storage_options) : null,
        specs: row.specs ? JSON.parse(row.specs) : null,
    };
}

// ─── API Routes ───

// GET /api/products — all products (with optional query filters)
app.get('/api/products', (req, res) => {
    const { category, minPrice, maxPrice, minRating, search, sort } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
        sql += ' AND category = ?';
        params.push(category);
    }
    if (minPrice) {
        sql += ' AND price >= ?';
        params.push(Number(minPrice));
    }
    if (maxPrice) {
        sql += ' AND price <= ?';
        params.push(Number(maxPrice));
    }
    if (minRating) {
        sql += ' AND rating >= ?';
        params.push(Number(minRating));
    }
    if (search) {
        sql += ' AND name LIKE ?';
        params.push(`%${search}%`);
    }

    // Sorting
    if (sort === 'price-asc') {
        sql += ' ORDER BY price ASC';
    } else if (sort === 'price-desc') {
        sql += ' ORDER BY price DESC';
    } else if (sort === 'rating-desc') {
        sql += ' ORDER BY rating DESC';
    }

    const rows = db.prepare(sql).all(...params);
    res.json(rows.map(parseProduct));
});

// GET /api/products/:id — single product
app.get('/api/products/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
    if (!row) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(parseProduct(row));
});

// GET /api/categories — list unique categories
app.get('/api/categories', (req, res) => {
    const rows = db.prepare('SELECT DISTINCT category FROM products').all();
    res.json(rows.map(r => r.category));
});

// POST /api/orders — save a new order
app.post('/api/orders', (req, res) => {
    const { orderId, items, subtotal, tax, total, shipping } = req.body;

    if (!orderId || !items || !total) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
        INSERT INTO orders (orderId, items, subtotal, tax, total, shippingName, shippingAddress, shippingCity, shippingPostal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        orderId,
        JSON.stringify(items),
        subtotal || 0,
        tax || 0,
        total,
        shipping?.name || null,
        shipping?.address || null,
        shipping?.city || null,
        shipping?.postal || null
    );

    res.status(201).json({ message: 'Order placed successfully', orderId });
});

// GET /api/orders — list all orders
app.get('/api/orders', (req, res) => {
    const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    res.json(rows.map(r => ({
        ...r,
        items: JSON.parse(r.items),
    })));
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 ShopZone API running at http://localhost:${PORT}`);
    console.log(`   📦 Database: SQLite`);
    console.log(`   GET  /api/products`);
    console.log(`   GET  /api/products/:id`);
    console.log(`   GET  /api/categories`);
    console.log(`   POST /api/orders`);
    console.log(`   GET  /api/orders\n`);
});
