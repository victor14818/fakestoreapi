class CartRepository {

  create() {
    throw new Error('CartRepository.create() must be implemented');
  }

  findById(id) {
    throw new Error('CartRepository.findById() must be implemented');
  }

  addItem() {
    throw new Error('CartRepository.addItem() must be implemented');
  }

  findItems(id) {
    throw new Error('CartRepository.findItems() must be implemented');
  }

  calculateTotal(id) {
    throw new Error('CartRepository.calculateTotal() must be implemented');
  }

}

module.exports = CartRepository;
