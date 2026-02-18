# Estrategia de Versionado de Productos

Para el versionado de productos se implementa un enfoque basado en: **Snapshots con Hash**

Utilizando las tablas
```
products            -> estado vigente
product_versions    -> histórico de cambios
```

# Proceso de Sincronización

Durante la sincronización de productos:

1. Se genera un hash utilizando los siguientes atributos:
```
title
category
image
price
cost
```
```bash
const hash = generateHashProduct({
  title: product.title,
  category: product.category,
  image: product.image,
  price,
  cost
});
```
2. Se realiza un UPSERT sobre la tabla: **products**, para reflejar el estado vigente.
3. Se consulta la última versión registrada del mismo producto en: **product_versions**
4. Si el hash generado difiere del último hash almacenado se registra una nueva versión en: **product_versions**

Esto permite:
- Evitar almacenamiento redundante
- Registrar únicamente cambios reales
- Reconstruir el historial de modificaciones

# Idempotencia y Concurrencia

## Técnicas de Idempotencia Utilizadas
1. Hash de Snapshot
Evita generar nuevas versiones cuando El estado del producto no ha cambiado.

2. UPSERT (ON CONFLICT)

Se utilizan sentencias:
```
INSERT ... ON CONFLICT DO UPDATE
```
En sincronización de productos e inserción de cart_items

Esto permite que:
- Múltiples requests iguales produzcan el mismo estado final
- Se eviten registros duplicados

3. Restricciones
Se definen índices únicos para reforzar idempotencia:
```
CREATE UNIQUE INDEX idx_cart_items_unique
ON cart_items(cart_id, product_id);
```

## Técnicas de Concurrencia
1. Transacciones

El uso de **better-sqlite3** permite ejecutar operaciones dentro de transacciones, las cuales garantizan:
- Atomicidad
- Aislamiento
- Rollback automático ante error

2. Actualización Incremental Segura
Por ejemplo al actualizar la cantidad en el carrito
```
quantity = quantity + excluded.quantity
```

3. Índices Únicos como Lock Lógico
