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
        throw new DomainValidationError("minPrice cannot be greater than maxPrice");
    }

    const allowedSortBy = ['price', 'latest'];
    const allowedSortOrder = ['asc', 'desc'];

    if (filters.sortBy && !allowedSortBy.includes(filters.sortBy)) {
      throw new DomainValidationError(`Invalid sortBy value ${filters.sortBy}`);
    }

    if (filters.sortOrder && !allowedSortOrder.includes(filters.sortOrder)) {
      throw new DomainValidationError(`Invalid sortOrder value ${filters.sortOrder}`);
    }

    return this.productRepository.findCatalog(filters);
  }

}

module.exports = GetCatalogUseCase;
