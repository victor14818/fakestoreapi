class SyncProductsUseCase {

  constructor(seedProductGateway, productRepository) {
    this.seedProductGateway = seedProductGateway;
    this.productRepository = productRepository;
  }

  async execute() {
    const products = await this.seedProductGateway.fetchProducts();
    
    // Simulating a 40% margin
    const costMargin = 0.6;

    products.forEach((x) => {
      x.sku = `FS-${x.id}`;
      x.cost = x.price * costMargin;
      x.is_active = 1;
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
