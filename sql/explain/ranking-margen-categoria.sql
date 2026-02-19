CREATE INDEX IF NOT EXISTS idx_products_active_category
ON products(is_active, category);

EXPLAIN QUERY PLAN 
WITH current_products AS (
  SELECT
    *,
    ((price - cost) * 1.0 / price) AS margin
  FROM products
  WHERE is_active = 1
),
ranked_products AS (
  SELECT *,
  ROW_NUMBER() OVER (
    PARTITION BY category
    ORDER BY margin ASC
  ) AS margin_rank_by_category
  FROM current_products
)

SELECT *
FROM ranked_products
WHERE margin_rank_by_category = 1
ORDER BY margin ASC
LIMIT 50;