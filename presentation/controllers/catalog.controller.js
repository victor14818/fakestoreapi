class CatalogController {
  constructor(
    getCatalogUseCase,
    getCatalogByIdUseCase
  ) {
    this.getCatalogUseCase = getCatalogUseCase;
    this.getCatalogByIdUseCase = getCatalogByIdUseCase;
  }

  async getCatalog(req, res, next) {
    try {
      let { page, pageSize, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
      
      page = Number(page) || 0;
      pageSize = Number(pageSize) || 10;
      category = category !== undefined ? category : null;
      minPrice = minPrice !== undefined ? Number(minPrice) : null;
      maxPrice = maxPrice !== undefined ? Number(maxPrice) : null;
      sortBy = sortBy !== undefined ? sortBy : null;
      sortOrder = sortOrder !== undefined ? sortOrder : 'asc';

      const result = await this.getCatalogUseCase.execute({
        page,
        pageSize,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder
      });

      return res.status(200).json({
        data: result.items,
        meta: {
          page,
          pageSize,
          total: result.total,
          hasNext: (page + 1) * pageSize < result.total
        }
      });

    } catch (error) {
      next(error);
    }
  }

  async getCatalogById(req, res, next) {
    try {
      const { id } = req.params;

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

    } catch (error) {
      next(error);
    }
  }

}

module.exports = CatalogController;