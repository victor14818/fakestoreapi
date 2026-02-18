# Herramientas

```
node --version
v24.13.0
```

```
sqlite3 --version 
3.51.2
```

# Guía de Ejecución

**Instalar dependencias**
```
npm install
```

**Ejecutar aplicación**
```
node index.js
```

# Dependencias
```json
"dependencies": {
    "better-sqlite3": "^12.6.2",
    "express": "^5.2.1"
}
```

# Arquitectura
La aplicación sigue una separación por capas.

```
├── presentation
│   ├── controllers
│   ├── middlewares
│   └── routes
│
├── application
│   └── use-cases
│       ├── cart
│       ├── catalog
│       └── product
│
├── domain
│   ├── errors
│   └── repositories
│
├── infrastructure
│   ├── database
│   │   ├── seed
│   │   └── sqlite
│   └── utils
```

# Sincronización de Productos
La carga inicial de productos se realiza desde:
```
infrastructure/database/seed/products.json
```

A través del repositorio:
```
product.seed.repository.js
```

# Parte A
## Endpoints Disponibles
### Sincronizar Productos
```bash
curl --location --request POST 'http://localhost:8080/products/sync' \
--header 'Content-Type: application/json' \
--data ''
```

### Listado de Catálogo
```bash
curl --location 'http://localhost:8080/catalog?pageSize=20&category=Accessories&minPrice=20&maxPrice=25.50&page=0' \
--header 'Content-Type: application/json'
```

### Detalle de Producto 
```bash
curl --location 'http://localhost:8080/catalog/1'
```

### Crear Carrito
```bash
curl --location 'http://localhost:8080/cart' \
--header 'Content-Type: application/json' \
--data '{ "userId": 1 }'
```

### Agregar Producto al Carrito
```bash
curl --location 'http://localhost:8080/cart/1/items' \
--header 'Content-Type: application/json' \
--data '{ "productId": 4, "quantity": 2 }'
```

## Detalle del Carrito
```bash
curl --location 'http://localhost:8080/cart/1' \
--header 'Content-Type: application/json' \
--data ''
```
# Parte B - Modelo de Datos
- Las tablas e índices se crean automáticamente al iniciar la aplicación.
- La configuración y creación del esquema se encuentra en:
```
infrastructure/database/sqlite/sqlite.connection.js
```

[Modelo de datos](docs/data_model.md)

# Parte C - Análisis SQL
Las consultas analíticas solicitadas se encuentran en:
```
sql/ranking-margen-categoria.sql
sql/cobertura-productos-carritos.sql
sql/cambios-productos.sql
```
Estas consultas pueden ejecutarse directamente sobre la base de datos SQLite generada por la aplicación.
