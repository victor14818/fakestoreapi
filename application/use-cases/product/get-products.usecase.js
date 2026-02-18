class GetProductsUseCase {

  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute() {
    const products = await this.productRepository.findAll();

    if (!products || products.length === 0) {
      return [];
    }

    return products;
  }

}

module.exports = GetProductsUseCase;
