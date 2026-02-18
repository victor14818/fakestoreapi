const ProductRepository = require('../../../domain/repositories/product.repository.interface');
const products = require('./products.json');

class SeedProductRepository extends ProductRepository {

  findAll() {
    return products;
  }

  findById(id) {
    const product = products.find(x => x.product_id === id);

    if (!product) {
      throw new Error(`Product ${id} not found`);
    }

    return product;
  }
}

module.exports = SeedProductRepository;
