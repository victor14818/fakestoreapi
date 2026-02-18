-- Cantidad de cambios por producto.
SELECT
  pv.product_id,
  pv.title,
  COUNT(*) - 1 AS change_count
FROM product_versions pv
GROUP BY pv.product_id;

-- Productos con más de N cambios.
SELECT
  pv.product_id,
  pv.title,
  COUNT(*) - 1 AS change_count
FROM product_versions pv
GROUP BY pv.product_id
HAVING change_count > 1

-- Tiempo promedio entre cambios.
WITH version_diffs AS (
  SELECT
    product_id,
    created_at,
    LAG(created_at) OVER (
      PARTITION BY product_id
      ORDER BY created_at
    ) AS prev_created_at
  FROM product_versions
),

time_between_changes AS (
  SELECT
    product_id,
    (unixepoch(created_at) - unixepoch(prev_created_at)) AS seconds_between_changes
  FROM version_diffs
  WHERE prev_created_at IS NOT NULL
)

SELECT
  product_id,
  AVG(seconds_between_changes) AS avg_seconds_between_changes
FROM time_between_changes
GROUP BY product_id;

-- Categorías más inestables.
WITH version_diffs AS (
  SELECT
    product_id,
    category,
    created_at,
    LAG(created_at) OVER (
      PARTITION BY product_id
      ORDER BY created_at
    ) AS prev_created_at
  FROM product_versions
),

time_between_changes AS (
  SELECT
    product_id,
    category,
    (unixepoch(created_at) - unixepoch(prev_created_at)) AS seconds_between_changes
  FROM version_diffs
  WHERE prev_created_at IS NOT NULL
),

avg_product_change AS (
  SELECT
    product_id,
    category,
    AVG(seconds_between_changes) AS avg_seconds_between_changes
  FROM time_between_changes
  GROUP BY product_id
)

SELECT
  category,
  AVG(avg_seconds_between_changes) AS avg_seconds_between_changes
FROM avg_product_change
GROUP BY category
ORDER BY avg_seconds_between_changes ASC;
