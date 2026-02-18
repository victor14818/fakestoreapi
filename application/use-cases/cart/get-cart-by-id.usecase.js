const DomainValidationError = require('../../../domain/errors/domain-validation.error');
const NotFoundError = require('../../../domain/errors/not-found.error');

class GetCartByIdUseCase {

  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  async execute(cartId) {
    const cart = this.cartRepository.findById(cartId);

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const items = this.cartRepository.findItems(cartId);

    const total = this.cartRepository.calculateTotal(cartId);

    return {
      cart,
      items,
      total
      // history: result.history,
      // hasRecentChange: result.hasRecentChange,
      // lastUpdated: result.product.updated_at,
      // currentPrice: result.product.price
    };

      const result = await this.getCatalogByIdUseCase.execute(id);

    
      return res.status(200).json({
        data: result.current,
        meta: {
          currentPrice: result.currentPrice,
          lastUpdated: result.lastUpdated,
          hasRecentChange: result.hasRecentChange,
          history: result.history
        }
      });
  }

}

module.exports = GetCartByIdUseCase;