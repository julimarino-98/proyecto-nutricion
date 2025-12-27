# Colección de Postman

En la carpeta `docs/` se incluye el archivo `postman-collection.json` listo para importar en Postman o en la extensión de VS Code (`Thunder Client`). La colección define el host mediante la variable `api_base` (valor por defecto: `http://localhost:5001/api`).

## Cómo importarla
1. Abre Postman y pulsa **Import**.
2. Selecciona el archivo `docs/postman-collection.json` de este repositorio.
3. En la pestaña **Variables** de la colección ajusta `api_base` si tu servidor corre en otra URL y asigna `jwt` con el token devuelto por `POST /auth/login`. (En la parte de "Body" cambiar a mail y contraseña con `admin@mail.com` `admin`)

## Contenido de la colección
- **Auth**: registro inicial, login y consulta del usuario autenticado.
- **Obras Sociales**: alta, edición, eliminación y listado con token.
- **Turnos**: agenda disponible, solicitud pública, listado filtrado, actualización de estado/datos y cancelación.

Cada request incluye ejemplos de cuerpo y headers para facilitar pruebas rápidas en los entornos **Local** y **Producción** (clonables dentro de Postman).
