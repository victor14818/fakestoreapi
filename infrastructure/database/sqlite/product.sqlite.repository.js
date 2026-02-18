const ProductRepository = require('../../../domain/repositories/product.repository.interface');
const { generateHashProduct } = require('../../utils/hash-helper');

class SQLiteProductRepository extends ProductRepository {

  constructor(dbConnection) {
    super();
    this.db = dbConnection.getConnection();
  }

  findAll() {
    const stmt = this.db.prepare('SELECT * FROM products');
    return stmt.all();
  }

  findById(id) {

    const stmt = this.db.prepare(`
      SELECT * 
      FROM products
      WHERE id = ?
    `);

    return stmt.get(id);
  }

  findCatalog(filters) {
    let where = `WHERE 1=1`;
    const params = [];

    if (filters.category) {
      where += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.minPrice !== null) {
      where += ` AND price >= ?`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== null) {
      where += ` AND price <= ?`;
      params.push(filters.maxPrice);
    }

    // Count total records
    const countSql = `SELECT COUNT(*) as total FROM products ${where}`;
    const totalRow = this.db.prepare(countSql).get(...params);
    const total = totalRow.total;

    // Query data
    const dataSql = `SELECT * FROM products ${where} LIMIT ? OFFSET ?`;
    const items = this.db.prepare(dataSql).all(
      ...params,
      filters.pageSize,
      filters.page * filters.pageSize
    );

    return {
      items,
      total
    }
  }

  findCatalogById(productId, historyLimit = 5) {
    const product = this.db.prepare(`
      SELECT *
      FROM products
      WHERE id = ?
    `).get(productId);

    if (!product) return null;

    const history = this.db.prepare(`
      SELECT price, cost, created_at
      FROM product_versions
      WHERE product_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(productId, historyLimit);

    // checking version in the last 24hrs
    const recentChange = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM product_versions
      WHERE product_id = ?
      AND created_at >= datetime('now', '-1 day')
    `).get(productId);

    return {
      product,
      history,
      hasRecentChange: recentChange.count > 1
    };
  }

  saveMany(products) {
    const upsertStmt = this.db.prepare(`
      INSERT INTO products
      (
        sku, title, category, image, price, cost, is_active, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(sku)
      DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        image = excluded.image,
        price = excluded.price,
        cost = excluded.cost,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at
    `);

    const findStmt = this.db.prepare(`
      SELECT id FROM products WHERE sku = ?
    `);  

    const lastVersionStmt = this.db.prepare(`
      SELECT hash
      FROM product_versions
      WHERE product_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);    

    const insertVersionStmt = this.db.prepare(`
      INSERT INTO product_versions
      (
        product_id, sku, title, category, image, price, cost, hash, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const tx = this.db.transaction((products) => {
      for (const product of products) {
                    
        const price = Math.round(Number(product.price) * 100) / 100;
        const cost  = Math.round(Number(product.cost) * 100) / 100;

        const hash = generateHashProduct({
          title: product.title,
          category: product.category,
          image: product.image,
          price,
          cost
        });

        // UPSERT current state
        upsertStmt.run(
          product.sku,
          product.title,
          product.category,
          product.image,
          price,
          cost,
          product.is_active
        );

        // GET local product id
        const localProductRow = findStmt.get(product.sku);
        if (!localProductRow) continue;

        const localProductId = localProductRow.id;

        // GET last version hash
        const lastProductVersion = lastVersionStmt.get(localProductId);

        // INSERT version
        if (!lastProductVersion || lastProductVersion.hash !== hash) {
          insertVersionStmt.run(
            localProductId,
            product.sku,
            product.title,
            product.category,
            product.image,
            price,
            cost,
            hash
          );              
        }
      }
    });
    
    try{
      tx(products);
      return products.length;
    } catch (error) {
      console.error("TX FAILED:", error.message);
      throw error;
    }
  }

}

module.exports = SQLiteProductRepository;