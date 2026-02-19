Actúa como un Product Manager + Solution Architect.

Genera un flujo de trabajo completo para un sistema de e-commerce donde un cliente pueda:

1. Visualizar productos en una página de listado (Listing Page).
2. Ingresar al detalle de un producto (Product Detail Page).
3. Agregar uno o múltiples productos al carrito.
4. Visualizar el carrito actualizado dinámicamente.
5. Confirmar la compra en un proceso de checkout de un solo paso.

El flujo debe considerar:

- Estados del carrito (vacío, con productos, confirmado).
- Validación de cantidad de productos (> 0).
- Persistencia del precio al momento de agregar (price snapshot).

Durante el proceso de confirmación de compra:

- Solicitar los datos para:
  - Envío (nombre, dirección, teléfono).
  - Facturación (nombre, nit).

Simular el proceso de pago con tarjeta de crédito bajo las siguientes reglas:

- La primera transacción debe ser siempre denegada.
- La segunda transacción debe ser autorizada.
- Mostrar mensajes adecuados según el resultado del intento de pago.
- Permitir reintentar el pago tras el primer rechazo.

Una vez autorizado el pago:

- Mostrar una pantalla de confirmación con:
  - Resumen de la orden
  - Productos comprados
  - Cantidades
  - Precio total
  - Dirección de envío
  - Estado de pago

Finalmente:

- Permitir al usuario iniciar un nuevo flujo de compra desde la pantalla de confirmación.

El resultado debe incluir:

- Diagrama de flujo del proceso, con validaciones requeridas en cada paso, eventos relevantes del sistema (ej: producto agregado, pago fallido, pago aprobado), 
- Diagrama de estados.

No incluir código de implementación. Enfocarse en el flujo funcional y de negocio.