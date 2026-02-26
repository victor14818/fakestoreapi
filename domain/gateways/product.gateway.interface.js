class ProductGateway {

  fetchProducts() {
    throw new Error('ProductGateway.fetchProducts() must be implemented');
  }

}

module.exports = ProductGateway;