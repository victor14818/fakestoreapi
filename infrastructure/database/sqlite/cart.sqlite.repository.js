const CartRepository = require('../../../domain/repositories/cart.repository.interface');

class SQLiteCartRepository extends CartRepository {

  constructor(dbConnection) {
    super();
    this.db = dbConnection;
  }

  create({ userId, status }) {
    const stmt = this.db.prepare(`
      INSERT INTO carts
      (
        user_id,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(userId, status);

    return {
      id: result.lastInsertRowid,
      userId,
      status
    };
  }

  findById(cartId) {
    const stmt = this.db.prepare(`
      SELECT * FROM carts
      WHERE id = ?
    `);

    return stmt.get(cartId);
  }

  addItem({ cartId, productId, quantity, unitPriceSnapshot }) {
    const stmt = this.db.prepare(`
      INSERT INTO cart_items
      (
        cart_id,
        product_id,
        quantity,
        unit_price_snapshot,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(cart_id, product_id)
      DO UPDATE SET
        quantity = quantity + excluded.quantity,
        updated_at = datetime('now')
    `);

    stmt.run(
      cartId,
      productId,
      quantity,
      unitPriceSnapshot
    );    
  }

  findItems(cartId) {
    const stmt = this.db.prepare(`
      SELECT 
        product_id,
        quantity,
        unit_price_snapshot
      FROM cart_items
      WHERE cart_id = ?
    `);

    return stmt.all(cartId);    
  }

  calculateTotal(cartId) {
    const stmt = this.db.prepare(`
      SELECT 
        SUM(quantity * unit_price_snapshot) as totalPrice
      FROM cart_items
      WHERE cart_id = ?
    `);

    return stmt.get(cartId).totalPrice;       
  }
}

module.exports = SQLiteCartRepository;