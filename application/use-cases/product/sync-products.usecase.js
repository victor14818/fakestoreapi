class SyncProductsUseCase {

  constructor(seedProductRepository, productRepository) {
    this.seedProductRepository = seedProductRepository;
    this.productRepository = productRepository;
  }

  async execute() {
    const products = await this.seedProductRepository.findAll();
    
    // Simulating a 40% margin
    const costMargin = 0.6;

    products.forEach((x) => {
      x.sku = `FS-${x.product_id}`;
      x.cost = x.price * costMargin;
    });

    try {
      const insertedProducts = await this.productRepository.saveMany(products);
      return { upserted: insertedProducts }

    } catch (error) {
      return { upserted: 0 };
    }
  }
}

module.exports = SyncProductsUseCase;
