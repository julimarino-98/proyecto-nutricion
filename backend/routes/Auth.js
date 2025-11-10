const express = require('express');
const jwt = require('jsonwebtoken');
const { Usuario, ROLES_PERMITIDOS } = require('../models/Usuario');
const auth = require('../middlewares/auth');

const router = express.Router();

const generarToken = usuario => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no configurado');
  }
  const payload = {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
};

const requiereAutenticacion = async (req, res, next) => {
  try {
    const cantidadUsuarios = await Usuario.countDocuments();
    if (cantidadUsuarios === 0) {
      return next();
    }

    return auth(['admin'])(req, res, next);
  } catch (error) {
    return res.status(500).json({ message: 'Error al validar permisos' });
  }
};

router.post('/register', requiereAutenticacion, async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
  }

  if (rol && !ROLES_PERMITIDOS.includes(rol)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  try {
    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    const usuario = await Usuario.create({ nombre, email, password, rol });
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const esValido = await usuario.compararPassword(password);
    if (!esValido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    try {
      const token = generarToken(usuario);
      return res.json({ token, usuario });
    } catch (error) {
      console.error('Error al generar el token:', error);
      return res.status(500).json({ message: 'Configuración de autenticación no disponible' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

router.get('/me', auth(), async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los datos del usuario' });
  }
});

module.exports = router;
