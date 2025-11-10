const jwt = require('jsonwebtoken');

const buildMiddleware = (rolesPermitidos = []) => async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ message: 'Token de autenticación no provisto' });
  }

  const token = header.substring(7);

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no configurado.');
      return res.status(500).json({ message: 'Configuración de autenticación no disponible' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(payload.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    req.usuario = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = buildMiddleware;
