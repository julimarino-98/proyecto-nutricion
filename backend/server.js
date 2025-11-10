// ¡CORRECCIÓN! Ponemos dotenv PRIMERO que nada.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
// Verificamos que MONGO_URI tenga un valor antes de conectar
if (!MONGO_URI) {
  console.error('Error: La variable de entorno MONGO_URI no está definida.');
  console.log('Asegúrate de que el archivo .env esté en la carpeta /backend y no tenga comentarios.');
  process.exit(1); // Detiene la aplicación si la URI no existe
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado exitosamente.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.get('/api', (req, res) => {
  res.json({ message: '¡Hola desde el backend de Nutrición!' });
});

// Usamos 'ObrasSociales' (con mayúscula) para que coincida con tu nombre de archivo
app.use('/api/obrassociales', require('./routes/ObrasSociales')); 

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});