const mongoose = require('mongoose');

const { Schema } = mongoose;

const ESTADOS_TURNO = ['solicitado', 'confirmado', 'cancelado', 'completado'];

const PacienteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const TurnoSchema = new Schema({
  paciente: {
    type: PacienteSchema,
    required: true
  },
  obraSocial: {
    type: Schema.Types.ObjectId,
    ref: 'ObraSocial',
    required: false
  },
  fechaHora: {
    type: Date,
    required: true
  },
  motivo: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ESTADOS_TURNO,
    default: 'solicitado'
  },
  notasInternas: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

TurnoSchema.index(
  { fechaHora: 1 },
  {
    unique: true,
    partialFilterExpression: {
      estado: { $in: ['solicitado', 'confirmado'] }
    }
  }
);

TurnoSchema.methods.toJSON = function toJSON() {
  const turno = this.toObject({ virtuals: true });
  delete turno.__v;
  return turno;
};

module.exports = {
  Turno: mongoose.model('Turno', TurnoSchema),
  ESTADOS_TURNO
};
