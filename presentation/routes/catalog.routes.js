const express = require('express');
const router = express.Router();

module.exports = function (catalogController) {

  router.get(
    '/',
    catalogController.getCatalog.bind(catalogController)
  );

  router.get(
    '/:id',
    catalogController.getCatalogById.bind(catalogController)
  );
  
  return router;
};
