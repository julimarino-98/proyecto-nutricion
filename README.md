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
    git clone <URL_DEL_REPOSITORIO>
    ```
    *(Si no usas Git, simplemente descarga y descomprime el archivo .zip del proyecto).*

2.  **Navegar a la Carpeta del Proyecto**
    ```bash
    cd <NOMBRE_DE_LA_CARPETA_DEL_PROYECTO>
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