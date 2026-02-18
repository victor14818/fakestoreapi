const DomainValidationError = require('../../../domain/errors/domain-validation.error');

class GetCatalogUseCase {

  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters) {
    
    if (filters.minPrice !== null && Number.isNaN(filters.minPrice)) {
      throw new DomainValidationError("minPrice must be a valid number");
    }
    
    if (filters.maxPrice !== null && Number.isNaN(filters.maxPrice)) {
      throw new DomainValidationError("maxPrice must be a valid number");
    }
    
    if (filters.minPrice !== null && filters.maxPrice !== null && filters.minPrice > filters.maxPrice) {
        throw new DomainValidationError(
            "minPrice cannot be greater than maxPrice"
        );
    }

    return this.productRepository.findCatalog(filters);
  }

}

module.exports = GetCatalogUseCase;
