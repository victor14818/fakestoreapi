const DomainValidationError = require('../../../domain/errors/domain-validation.error');
const NotFoundError = require('../../../domain/errors/not-found.error');

class AddCartItemUseCase {

  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute({ cartId, productId, quantity }) {

    if (quantity <= 0) {
      throw new DomainValidationError("quantity must be > 0");
    }

    const product = this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.is_active !== 1) {
      throw new DomainValidationError("Product is inactive");
    }

    const cart = this.cartRepository.findById(cartId);

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    if (cart.status !== 'open') {
      throw new DomainValidationError("Cart is closed");
    }

    const unitPriceSnapshot = product.price;

    this.cartRepository.addItem({
      cartId,
      productId,
      quantity,
      unitPriceSnapshot
    });
  }
}

module.exports = AddCartItemUseCase;