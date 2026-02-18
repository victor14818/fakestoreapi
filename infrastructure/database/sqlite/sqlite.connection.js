const Database = require('better-sqlite3');

class SQLiteConnection {

  constructor() {
    this.db = new Database('database.db');
    this.seedDatabase();
  }

  getConnection() {
    return this.db;
  }

  seedDatabase() {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        category TEXT,
        image TEXT,
        price REAL NOT NULL,
        cost REAL NOT NULL,
        is_active INTEGER NOT NULL CHECK (is_active IN (0,1)),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS product_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        sku TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT,
        image TEXT,
        price REAL NOT NULL,
        cost REAL NOT NULL,
        hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES products(id)
      );
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('open', 'closed')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        unit_price_snapshot REAL NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(cart_id) REFERENCES carts(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      );
    `).run();

    this.db.prepare(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique
      ON cart_items(cart_id, product_id);
    `).run();
  }

}

module.exports = new SQLiteConnection();

// index
// CREATE INDEX IF NOT EXISTS idx_snapshots_product_time
// ON product_snapshots(product_id, created_at DESC);
