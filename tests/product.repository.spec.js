const SQLiteProductRepository = require('../infrastructure/database/sqlite/product.sqlite.repository');

describe('ProductRepository.findCatalog', () => {

  let mockDb;
  let repo;

  beforeEach(() => {

    mockDb = {
      prepare: jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({ total: 25 }),
        all: jest.fn().mockReturnValue([
          { id: 1, price: 10 }
        ])
      })
    };

    repo = new SQLiteProductRepository(mockDb);
  });

  it('should return paginated results', () => {

    const result = repo.findCatalog({
      page: 0,
      pageSize: 10,
      category: null,
      minPrice: null,
      maxPrice: null,
      sortBy: null,
      sortOrder: null
    });

    expect(result.total).toBe(25);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('should order by price asc', () => {

    repo.findCatalog({
      page: 0,
      pageSize: 10,
      sortBy: 'price',
      sortOrder: 'asc'
    });

    expect(mockDb.prepare).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY price ASC')
    );

  });

  it('should order by created_at desc when latest', () => {

    repo.findCatalog({
      page: 0,
      pageSize: 10,
      sortBy: 'latest',
      sortOrder: 'desc'
    });

    expect(mockDb.prepare).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY created_at DESC')
    );

  });

  it('should ignore invalid sortBy values', () => {

    repo.findCatalog({
      page: 0,
      pageSize: 10,
      sortBy: 'price; DROP TABLE',
      sortOrder: 'asc'
    });

    expect(mockDb.prepare).not.toHaveBeenCalledWith(
      expect.stringContaining('DROP TABLE')
    );

  });

});
