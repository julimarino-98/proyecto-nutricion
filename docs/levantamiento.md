# Guía completa para levantar el proyecto

Esta guía resume los pasos para ejecutar el **frontend** y el **backend** en entorno local, además de consejos para verificación rápida.

## 1. Requisitos previos
- **Node.js 18+** (incluye `npm`).
- **MongoDB** en ejecución (local o remoto) y una cadena de conexión válida.

## 2. Levantar el frontend (React + Vite)
1. Instala dependencias en la raíz del proyecto:
   ```bash
   npm install
   ```
2. Inicia el modo desarrollo (puerto por defecto: `5173`):
   ```bash
   npm run dev
   ```
3. Abre el navegador en la URL que muestre la terminal (habitualmente `http://localhost:5173`).

## 3. Levantar el backend (Express + MongoDB)
1. Posiciónate en la carpeta `backend` e instala dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Copia el archivo de entorno de ejemplo y completa los valores requeridos:
   ```bash
   cp .env.example .env
   # Ajusta MONGO_URI (cadena de conexión) y JWT_SECRET (clave para tokens)
   # Opcional: configura MAIL_FROM y RESEND_API_KEY para el envío de correos
   ```
3. Inicia el servidor en modo desarrollo (puerto por defecto: `5001`):
   ```bash
   npm run dev
   ```
4. Comprueba que el backend responde visitando `http://localhost:5001/api`.

## 4. Crear datos iniciales
El backend crea el primer usuario **sin requerir token** mediante `POST /api/auth/register`. Si prefieres automatizar la creación de un usuario administrativo y datos básicos, ejecuta el script incluido:

```bash
cd backend
npm run init:db
```

El script lee las variables opcionales `INIT_ADMIN_EMAIL`, `INIT_ADMIN_PASSWORD` e `INIT_ADMIN_NAME` del `.env` para crear (solo si no existe) un usuario con rol `admin` y cargar obras sociales de ejemplo.

## 5. Resumen rápido de comandos
| Acción                                   | Comando                                           |
| ---------------------------------------- | ------------------------------------------------- |
| Instalar dependencias frontend           | `npm install`                                     |
| Servidor de desarrollo frontend          | `npm run dev`                                     |
| Instalar dependencias backend            | `cd backend && npm install`                       |
| Servidor de desarrollo backend           | `cd backend && npm run dev`                       |
| Inicializar base de datos de apoyo       | `cd backend && npm run init:db`                   |
| Build de producción del frontend         | `npm run build`                                   |
| Previsualización de la build (frontend)  | `npm run preview`                                 |


