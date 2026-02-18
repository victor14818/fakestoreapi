class CartController {
  constructor(
    createCartUseCase,
    addCartItemUseCase,
    getCartByIdUseCase
  ) {
    this.createCartUseCase = createCartUseCase;
    this.addCartItemUseCase = addCartItemUseCase;
    this.getCartByIdUseCase = getCartByIdUseCase;
  }

  async createCart(req, res, next) {
    try {
      const { userId } = req.body;
      const cart = await this.createCartUseCase.execute(userId);
      return res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  }

  async getCartById(req, res, next) {
    try {
      const id = Number(req.params.id);

      const result = await this.getCartByIdUseCase.execute(id);

      return res.status(200).json({
        data: result.cart,
        items: result.items,
        total: result.total
        // meta: {
        //   currentPrice: result.currentPrice,
        //   lastUpdated: result.lastUpdated,
        //   hasRecentChange: result.hasRecentChange,
        //   history: result.history
        // }
      });

    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const cartId = Number(req.params.id);
      const { productId, quantity } = req.body;

      await this.addCartItemUseCase.execute({
        cartId,
        productId,
        quantity
      });

      return res.status(201).json({
        message: 'Item added to cart'
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = CartController;