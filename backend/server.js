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
if (!MONGO_URI) {
  console.error('Error: La variable de entorno MONGO_URI no está definida.');
  console.log('Asegúrate de que el archivo .env esté en la carpeta /backend y no tenga comentarios.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado exitosamente.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.get('/api', (req, res) => {
  res.json({ message: '¡Hola desde el backend de Nutrición!' });
});

app.use('/api/auth', require('./routes/Auth'));
app.use('/api/obrassociales', require('./routes/ObrasSociales'));
app.use('/api/turnos', require('./routes/Turnos'));

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Error no controlado:', err);
  res.status(err.status || 500).json({ message: err.message || 'Error inesperado' });
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
