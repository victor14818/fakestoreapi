const express = require('express');
const router = express.Router();

module.exports = function (productController) {

  router.get(
    '/',
    productController.getProducts.bind(productController)
  );

  router.get(
    '/:id',
    productController.getProductById.bind(productController)
  );

  router.post(
    '/sync',
    productController.syncProducts.bind(productController)
  );

  return router;
};
