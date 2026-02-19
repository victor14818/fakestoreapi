CREATE INDEX IF NOT EXISTS idx_cart_status
ON carts(status);

-- % de productos vigentes que están en al menos un carrito abierto.

EXPLAIN QUERY PLAN
WITH open_cart_products AS (
  SELECT DISTINCT ci.product_id
  FROM cart_items ci
  JOIN carts c
    ON ci.cart_id = c.id
  WHERE c.status = 'open'
),
active_products AS (
  SELECT p.id
  FROM products p
  WHERE p.is_active = 1
)

SELECT
  COUNT(DISTINCT ocp.product_id) * 100.0 / COUNT(DISTINCT ap.id) AS percentage_metric
FROM active_products ap
LEFT JOIN open_cart_products ocp
  ON ap.id = ocp.product_id;

-- Distribución por categoría de productos vigentes que están en al menos un carrito abierto.

EXPLAIN QUERY PLAN
WITH open_cart_products AS (
  SELECT DISTINCT ci.product_id
  FROM cart_items ci
  JOIN carts c
    ON ci.cart_id = c.id
  WHERE c.status = 'open'
),
active_used_products AS (
  SELECT p.id, p.category
  FROM products p
  JOIN open_cart_products ocp
    ON p.id = ocp.product_id
  WHERE p.is_active = 1
)

SELECT
  category,
  COUNT(*) AS distribution_count
FROM active_used_products
GROUP BY category;

-- Top 20 productos más agregados.

EXPLAIN QUERY PLAN
SELECT
  ci.product_id,
  p.category,
  SUM(ci.quantity) AS total_quantity_added
FROM cart_items ci
JOIN carts c
  ON c.id = ci.cart_id
JOIN products p
  ON p.id = ci.product_id
WHERE
  c.status = 'open'
GROUP BY
  ci.product_id
ORDER BY
  total_quantity_added DESC
LIMIT 20;

-- Total quantity agregada por producto.

EXPLAIN QUERY PLAN
SELECT
  ci.product_id,
  p.title,
  SUM(ci.quantity) AS total_quantity_added
FROM cart_items ci
JOIN carts c
  ON c.id = ci.cart_id
JOIN products p
  ON p.id = ci.product_id
WHERE 
  c.status = 'open'
GROUP BY 
  ci.product_id;