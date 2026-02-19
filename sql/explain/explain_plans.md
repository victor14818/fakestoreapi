# Query 1: Ranking Margen x Categorias

```
QUERY PLAN
|--CO-ROUTINE ranked_products
|  |--CO-ROUTINE (subquery-4)
|  |  |--SCAN products
|  |  `--USE TEMP B-TREE FOR ORDER BY
|  `--SCAN (subquery-4)
|--SCAN ranked_products
`--USE TEMP B-TREE FOR ORDER BY
```

## Potenciales bottlenecks
1. Full Table Scan sobre la tabla products, a pesar de contar con un filtro por is_active. Esto implica que la base de datos está evaluando todas las filas antes de aplicar el filtro.
2. La windows function RANK() requiere realizar un ordenamiento por categoría y margen, lo cual crea un conjunto intermedio de datos.
3. Se lee toda la tabla temporal usada por la windows function.
4. Se realiza un segundo ordenamiento global de los datos al final.

## Propuesta de optimización
1. Agregar un índice en los campos utilizados en el query
```
CREATE INDEX idx_products_active_category
ON products(is_active, category);
```
Este índice ayuda a filtrar primero los productos activos y a optimizar la partición por categoría dentro de la window function.

2. Cambiar la windows function RANK() por ROW_NUMBER()
Esto ya que se realiza un segundo order by al final.

## Explain Plan después de aplicar optimizaciones.
```
QUERY PLAN
|--CO-ROUTINE ranked_products
|  |--CO-ROUTINE (subquery-4)
|  |  |--SEARCH products USING INDEX idx_products_active_category (is_active=?)
|  |  `--USE TEMP B-TREE FOR LAST TERM OF ORDER BY
|  `--SCAN (subquery-4)
|--SCAN ranked_products
`--USE TEMP B-TREE FOR ORDER BY
```

1. Se elimina el Full Table Scan, pasando a utilizar el índice idx_products_active_category para filtrar productos activos.
2. El mismo índice es aprovechado durante la ejecución de la window function para la partición por categoría.
3. Se reduce el volumen de datos procesados antes del cálculo del ranking final.

# Query 2
```
QUERY PLAN
|--MATERIALIZE open_cart_products
|  |--SCAN c
|  |--SEARCH ci USING COVERING INDEX idx_cart_items_unique (cart_id=?)
|  `--USE TEMP B-TREE FOR DISTINCT
|--USE TEMP B-TREE FOR count(DISTINCT)
|--USE TEMP B-TREE FOR count(DISTINCT)
|--SEARCH p USING COVERING INDEX idx_products_active_category (is_active=?)
|--BLOOM FILTER ON ocp (product_id=?)
`--SEARCH ocp USING AUTOMATIC COVERING INDEX (product_id=?) LEFT-JOIN
QUERY PLAN
|--CO-ROUTINE open_cart_products
|  |--SCAN c
|  |--SEARCH ci USING COVERING INDEX idx_cart_items_unique (cart_id=?)
|  `--USE TEMP B-TREE FOR DISTINCT
|--SEARCH p USING COVERING INDEX idx_products_active_category (is_active=?)
|--BLOOM FILTER ON ocp (product_id=?)
`--SEARCH ocp USING AUTOMATIC COVERING INDEX (product_id=?)
QUERY PLAN
|--SCAN ci USING INDEX idx_cart_items_unique
|--SEARCH p USING INTEGER PRIMARY KEY (rowid=?)
|--SEARCH c USING INTEGER PRIMARY KEY (rowid=?)
|--USE TEMP B-TREE FOR GROUP BY
`--USE TEMP B-TREE FOR ORDER BY
QUERY PLAN
|--SCAN ci USING INDEX idx_cart_items_unique
|--SEARCH p USING INTEGER PRIMARY KEY (rowid=?)
|--SEARCH c USING INTEGER PRIMARY KEY (rowid=?)
`--USE TEMP B-TREE FOR GROUP BY
```

## Potenciales bottlenecks
1. Full table scan en carts para encontrar los que están en estado "open".
2. Se ordena en memoria por la función DISTINCT.

## Propuesta de optimización

1. El índice anterior idx_products_active_category ya está siendo en estos queries para filtrar productos activos.
2. El índice ya creado idx_cart_items_unique para asegurar que no hayan duplicados en un carrito está siendo usado.
```
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique
ON cart_items(cart_id, product_id);
```
3. Agregar un índice para filtar los carts en estado "open"
```
CREATE INDEX idx_cart_status
ON carts(status);
```

## Explain Plan después de aplicar optimizaciones.
```
QUERY PLAN
|--MATERIALIZE open_cart_products
|  |--SEARCH c USING COVERING INDEX idx_cart_status (status=?)
|  |--SEARCH ci USING COVERING INDEX idx_cart_items_unique (cart_id=?)
|  `--USE TEMP B-TREE FOR DISTINCT
|--USE TEMP B-TREE FOR count(DISTINCT)
|--USE TEMP B-TREE FOR count(DISTINCT)
|--SEARCH p USING COVERING INDEX idx_products_active_category (is_active=?)
|--BLOOM FILTER ON ocp (product_id=?)
`--SEARCH ocp USING AUTOMATIC COVERING INDEX (product_id=?) LEFT-JOIN
QUERY PLAN
|--CO-ROUTINE open_cart_products
|  |--SEARCH c USING COVERING INDEX idx_cart_status (status=?)
|  |--SEARCH ci USING COVERING INDEX idx_cart_items_unique (cart_id=?)
|  `--USE TEMP B-TREE FOR DISTINCT
|--SEARCH p USING COVERING INDEX idx_products_active_category (is_active=?)
|--BLOOM FILTER ON ocp (product_id=?)
`--SEARCH ocp USING AUTOMATIC COVERING INDEX (product_id=?)
QUERY PLAN
|--SEARCH c USING COVERING INDEX idx_cart_status (status=?)
|--SEARCH ci USING INDEX idx_cart_items_unique (cart_id=?)
|--SEARCH p USING INTEGER PRIMARY KEY (rowid=?)
|--USE TEMP B-TREE FOR GROUP BY
`--USE TEMP B-TREE FOR ORDER BY
QUERY PLAN
|--SEARCH c USING COVERING INDEX idx_cart_status (status=?)
|--SEARCH ci USING INDEX idx_cart_items_unique (cart_id=?)
|--SEARCH p USING INTEGER PRIMARY KEY (rowid=?)
`--USE TEMP B-TREE FOR GROUP BY
```

1. Se elimina el Full Table Scan, pasando a utilizar el índice idx_cart_status para filtrar carts activos.