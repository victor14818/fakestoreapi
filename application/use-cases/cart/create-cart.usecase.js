const DomainValidationError = require('../../../domain/errors/domain-validation.error');

class CreateCartUseCase {

  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  async execute(userId) {

    if (!userId) {
      throw new DomainValidationError("userId is required");
    }

    return this.cartRepository.create({
      userId,
      status: 'open'
    });
  }
}

module.exports = CreateCartUseCase;