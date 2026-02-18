const NotFoundError = require('../../../domain/errors/not-found.error');

class GetCatalogByIdUseCase {

  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId) {

    const result = this.productRepository.findCatalogById(productId);
    
    if (!result) {
      throw new NotFoundError(`Product ${productId} not found`);
    }

    return {
      current: result.product,
      history: result.history,
      hasRecentChange: result.hasRecentChange,
      lastUpdated: result.product.updated_at,
      currentPrice: result.product.price
    };
  }

}

module.exports = GetCatalogByIdUseCase;
