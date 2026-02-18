const express = require('express');
const router = express.Router();

module.exports = function (cartController) {

  router.post(
    '/',
    cartController.createCart.bind(cartController)
  );

  router.get(
    '/:id',
    cartController.getCartById.bind(cartController)
  );

  router.post(
    '/:id/items',
    cartController.addItem.bind(cartController)
  );
  
  return router;
};
