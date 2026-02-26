const express = require('express');
const app = express();
const port = 8080;

// Presentation
const productRoutes = require('./presentation/routes/product.routes');
const catalogRoutes = require('./presentation/routes/catalog.routes');
const cartRoutes = require('./presentation/routes/cart.routes');
const errorMiddleware = require('./presentation/middlewares/error.middleware');
const ProductController = require('./presentation/controllers/product.controller');
const CatalogController = require('./presentation/controllers/catalog.controller');
const CartController = require('./presentation/controllers/cart.controller');

// Application
const GetProductsUseCase = require('./application/use-cases/product/get-products.usecase');
const GetProductByIDUseCase = require('./application/use-cases/product/get-product-by-id.usecase');
const SyncProductsUseCase = require('./application/use-cases/product/sync-products.usecase');
const GetCatalogUseCase = require('./application/use-cases/catalog/get-catalog.usecase');
const GetCatalogByIdUseCase = require('./application/use-cases/catalog/get-catalog-by-id.usecase');
const CreateCartUseCase = require('./application/use-cases/cart/create-cart.usecase');
const AddCartItemUseCase = require('./application/use-cases/cart/add-cart-item.usecase');
const GetCartByIdUseCase = require('./application/use-cases/cart/get-cart-by-id.usecase');

// Domain
const NotFoundError = require('./domain/errors/not-found.error');

// Infraestructure
const sqliteConnection = require('./infrastructure/database/sqlite/sqlite.connection');
const SQLiteProductRepository = require('./infrastructure/database/sqlite/product.sqlite.repository');
const SeedProductRepository = require('./infrastructure/database/seed/product.seed.repository');
const SQLiteCartRepository = require('./infrastructure/database/sqlite/cart.sqlite.repository');
const AxiosFakeStoreApiGateway = require('./infrastructure/gateways/fakestoreapi/fakestoreapi.axios.gateway');

app.use(express.json());

// Dependency Injection
const productRepo = new SQLiteProductRepository(sqliteConnection);
const productSeedRepo = new SeedProductRepository();
const cartRepo = new SQLiteCartRepository(sqliteConnection);
const fakestoreapiGateway = new AxiosFakeStoreApiGateway();

const getProductsUseCase = new GetProductsUseCase(productRepo);
const getProductByIdUseCase = new GetProductByIDUseCase(productRepo);
const syncProductsUseCase = new SyncProductsUseCase(fakestoreapiGateway, productRepo);
const getCatalogUseCase = new GetCatalogUseCase(productRepo);
const getCatalogByIdUseCase = new GetCatalogByIdUseCase(productRepo);
const createCartUseCase = new CreateCartUseCase(cartRepo);
const addCartItemUseCase = new AddCartItemUseCase(cartRepo, productRepo);
const getCartByIdUseCase = new GetCartByIdUseCase(cartRepo);

const productController = new ProductController(
  syncProductsUseCase, 
  getProductsUseCase, 
  getProductByIdUseCase,
);

const catalogController = new CatalogController(
  getCatalogUseCase,
  getCatalogByIdUseCase
);

const cartController = new CartController(
  createCartUseCase,
  addCartItemUseCase,
  getCartByIdUseCase
);

// Register routes
app.use('/products', productRoutes(productController));
app.use('/catalog', catalogRoutes(catalogController));
app.use('/cart', cartRoutes(cartController));

// Register Not Found Route
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Register middlewares
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`FakeStoreAPI app listening on port ${port}`);
});