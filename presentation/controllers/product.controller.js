class ProductController {
  constructor(
    syncProductsUseCase,
    getProductsUseCase,
    getProductByIdUseCase,
  ) {
    this.syncProductsUseCase = syncProductsUseCase;
    this.getProductsUseCase = getProductsUseCase;
    this.getProductByIdUseCase = getProductByIdUseCase;
  }

  async getProducts(req, res, next) {
    try {
      const products = await this.getProductsUseCase.execute();
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await this.getProductByIdUseCase.execute(id);

      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }

      return res.status(200).json(product);

    } catch (error) {
      next(error);
    }
  }

  async syncProducts(req, res, next) {
    try {
      const products = await this.syncProductsUseCase.execute();
      return res.status(201).json(products);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;