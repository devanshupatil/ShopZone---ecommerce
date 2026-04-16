/**
 * Database setup — creates tables and seeds product data from products.json
 * Run once: node db/setup.js
 * Or imported automatically by server.js on first run
 */
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.VERCEL || process.env.NODE_ENV === 'production'
    ? '/tmp/shopzone.db'
    : path.join(__dirname, 'shopzone.db');

function initDB() {
    const db = new Database(DB_PATH);

    // Enable WAL for better concurrent read performance
    db.pragma('journal_mode = WAL');

    // Create tables
    db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      originalPrice REAL,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      badge TEXT,
      emoji TEXT,
      image TEXT,
      colors TEXT,
      storage_options TEXT,
      specs TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL UNIQUE,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      shippingName TEXT,
      shippingAddress TEXT,
      shippingCity TEXT,
      shippingPostal TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

    return db;
}

function seedProducts(db) {
    const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get().cnt;
    if (count > 0) {
        console.log(`✅ Database already has ${count} products`);
        return;
    }

    const productsPath = path.join(__dirname, '..', 'data', 'products.json');
    let products = [];
    try {
        products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    } catch (err) {
        console.error('❌ Could not read products.json:', err.message);
        return;
    }

    const insert = db.prepare(`
    INSERT INTO products (name, category, price, originalPrice, rating, reviews, badge, emoji, image, colors, storage_options, specs)
    VALUES (@name, @category, @price, @originalPrice, @rating, @reviews, @badge, @emoji, @image, @colors, @storage_options, @specs)
  `);

    const insertMany = db.transaction((items) => {
        for (const p of items) {
            insert.run({
                name: p.name,
                category: p.category,
                price: p.price,
                originalPrice: p.originalPrice || null,
                rating: p.rating || 0,
                reviews: p.reviews || 0,
                badge: p.badge || null,
                emoji: p.emoji || null,
                image: p.image || null,
                colors: p.colors ? JSON.stringify(p.colors) : null,
                storage_options: p.storage_options ? JSON.stringify(p.storage_options) : null,
                specs: p.specs ? JSON.stringify(p.specs) : null,
            });
        }
    });

    insertMany(products);
    console.log(`✅ Seeded ${products.length} products into SQLite`);
}

// Run if called directly
if (require.main === module) {
    const db = initDB();
    seedProducts(db);
    db.close();
    console.log('✅ Database setup complete');
}

module.exports = { initDB, seedProducts, DB_PATH };
