class ProductRepository {

  findAll() {
    throw new Error('ProductRepository.findAll() must be implemented');
  }

  findById(id) {
    throw new Error('ProductRepository.findById() must be implemented');
  }

  findCatalog(filters) {
    throw new Error('ProductRepository.findCatalog() must be implemented');
  }

  findCatalogById(productId, historyLimit) {
    throw new Error('ProductRepository.findCatalogById() must be implemented');
  }

  saveMany(products) {
    throw new Error('ProductRepository.saveMany() must be implemented');
  }

}

module.exports = ProductRepository;
