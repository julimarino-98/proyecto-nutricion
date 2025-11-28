# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# TPO API 2C - Nutricionista

Este repositorio contiene el código fuente del **frontend** para el sitio web profesional de la Lic. Belén Marino.

## Tecnologías Utilizadas 🛠️

* **React:** Librería principal para la construcción de la interfaz de usuario.
* **Vite:** Herramienta de construcción y servidor de desarrollo rápido.
* **React Router DOM:** Para la gestión de rutas y la navegación (ej. `/`, `/login`, `/admin`).
* **React Bootstrap y MDB React UI Kit:** Librerías de componentes para una construcción rápida y responsiva de la interfaz (Navbar, Grids, Cards, Modals, etc.).
* **React Bootstrap Icons:** Para una iconografía consistente y de alta calidad.
* **React Datepicker:** Para el componente de calendario en el formulario de turnos.
* **CSS:** Estilos personalizados para adaptar el diseño a la identidad de la marca.

---

## Puesta en Marcha 🚀

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Requisitos Previos

Asegúrate de tener instalado **Node.js** (versión 18 o superior). Puedes descargarlo desde [nodejs.org](https://nodejs.org/). La instalación de Node.js incluye automáticamente **npm**.

### Pasos de Instalación

1.  **Clonar el Repositorio**
    Abre una terminal y clona este repositorio en tu computadora:
    ```bash
    git clone https://github.com/julimarino-98/proyecto-nutricion.git
    ```
    *(Si no usas Git, simplemente descarga y descomprime el archivo .zip del proyecto).*

2.  **Navegar a la Carpeta del Proyecto**
    ```bash
    cd proyecto-nutricion
    ```

3.  **Instalar Dependencias**
    Este comando leerá el archivo `package.json` y descargará todas las librerías necesarias en la carpeta `node_modules`.
    ```bash
    npm install
    ```

4.  **Iniciar el Servidor de Desarrollo**
    Este comando iniciará la aplicación en modo de desarrollo y te dará una URL local para verla en el navegador.
    ```bash
    npm run dev
    ```

5.  **Abrir en el Navegador**
    Abre tu navegador web y ve a la dirección que aparece en la terminal (usualmente `http://localhost:5173`).

---

## Credenciales de Acceso (Simuladas)

El proyecto incluye un flujo de autenticación simulado para el panel de administración. Para acceder, utiliza las siguientes credenciales en la página `/login`:

* **Email:** `admin@mail.com`
* **Contraseña:** `admin`

---

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

* `npm run dev`: Inicia la aplicación en modo de desarrollo.
* `npm run build`: Compila la aplicación para producción en la carpeta `dist`.
* `npm run preview`: Sirve la build de producción localmente para previsualizarla.

---

## Backend (Express + MongoDB)

El proyecto ahora incluye una API REST construida con **Express**, **Mongoose** y **JWT** para cubrir los requerimientos del trabajo práctico: alta de obras sociales, reserva y confirmación de turnos, y autenticación para el personal (médico/secretaria).

### Puesta en marcha

```bash
cd backend
npm install
cp .env.example .env # Ajusta MONGO_URI y JWT_SECRET
npm run dev           # Inicia el servidor con nodemon en http://localhost:5001
```

> El primer usuario administrativo se crea con una petición `POST /api/auth/register`. A partir del segundo registro se exigirá un token de un usuario con rol `admin`.

### Variables de entorno (`backend/.env`)

| Variable      | Descripción                                           |
| ------------- | ----------------------------------------------------- |
| `MONGO_URI`   | Cadena de conexión a tu instancia de MongoDB.         |
| `PORT`        | Puerto (opcional) donde escuchará el servidor Express |
| `JWT_SECRET`  | Clave secreta usada para firmar y validar los JWT     |

### Endpoints principales

#### Autenticación (`/api/auth`)

| Método | Ruta           | Descripción                                                                    |
| ------ | -------------- | ------------------------------------------------------------------------------ |
| POST   | `/register`    | Crea usuarios. Libre solo si no existen usuarios, luego requiere rol `admin`. |
| POST   | `/login`       | Devuelve token JWT y datos básicos del usuario.                               |
| GET    | `/me`          | Retorna los datos del usuario autenticado.                                     |

#### Obras Sociales (`/api/obrassociales`)

| Método | Ruta            | Descripción                                                   |
| ------ | --------------- | ------------------------------------------------------------- |
| GET    | `/`             | Lista ordenada de obras sociales (pública).                   |
| POST   | `/`             | Alta de obra social (requiere token de médico/secretaria).    |
| PUT    | `/:id`          | Modificación de obra social existente (con autenticación).    |
| DELETE | `/:id`          | Eliminación de obra social (con autenticación).               |

#### Turnos (`/api/turnos`)

| Método | Ruta           | Descripción                                                                 |
| ------ | -------------- | --------------------------------------------------------------------------- |
| GET    | `/`            | Lista turnos por estado/rango de fechas (requiere token).                    |
| GET    | `/disponibles` | Devuelve agenda libre (lunes a viernes de 9 a 12 y de 14 a 18 hs).          |
| POST   | `/`            | Solicitud pública de turno, valida disponibilidad y datos del paciente.      |
| PATCH  | `/:id`         | Actualiza datos del turno o cambia estado (requiere token).                  |
| DELETE | `/:id`         | Marca un turno como cancelado manteniendo el historial (requiere token).     |

Los estados admitidos para un turno son: `solicitado`, `confirmado`, `cancelado` y `completado`. Los horarios disponibles se calculan automáticamente considerando lunes a viernes con dos bloques: 9 a 12 h y 14 a 18 h. El tamaño del bloque es configurable mediante el parámetro `duracion` (por defecto, 30 minutos).

### Notificaciones por correo

El backend envía dos correos automáticos al paciente (uno cuando solicita el turno y otro cuando el staff confirma o cancela). Para activarlos debes [crear una API key en Resend](https://resend.com/) o en un proveedor compatible con su API y completar estas variables en `backend/.env`:

```
MAIL_FROM="Nombre <remitente@tudominio.com>"
RESEND_API_KEY=tu_clave
```

Si los datos no están configurados, la API seguirá funcionando, pero los correos se omitirán y se mostrará un aviso en la consola del servidor.

### Pruebas rápidas con `curl`

```bash
# Crear usuario inicial (solo la primera vez)
curl -X POST http://localhost:5001/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Admin","email":"admin@nutri.com","password":"secreta","rol":"admin"}'

# Solicitar turno público
curl -X POST http://localhost:5001/api/turnos \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","apellido":"Pérez","email":"ana@mail.com","telefono":"1122334455","fechaHora":"2024-07-15T14:00:00.000Z"}'

# Obtener turnos confirmados (requiere token)
curl http://localhost:5001/api/turnos?estado=confirmado \
  -H "Authorization: Bearer <TOKEN>"
```
