const crypto = require('crypto');

function generateHashProduct(product) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify({
      title: product.title,
      category: product.category,
      image: product.image,
      price: product.price,
      cost: product.cost
    }))
    .digest('hex');
}

module.exports = {
    generateHashProduct
};