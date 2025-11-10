const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const ROLES_PERMITIDOS = ['medico', 'secretaria', 'admin'];

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ROLES_PERMITIDOS,
    default: 'medico'
  }
}, {
  timestamps: true
});

UsuarioSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

UsuarioSchema.methods.compararPassword = function compararPassword(passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password);
};

UsuarioSchema.methods.toJSON = function toJSON() {
  const usuario = this.toObject({ virtuals: true });
  delete usuario.password;
  delete usuario.__v;
  return usuario;
};

module.exports = {
  Usuario: mongoose.model('Usuario', UsuarioSchema),
  ROLES_PERMITIDOS
};
