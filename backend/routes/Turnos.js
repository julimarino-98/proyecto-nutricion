const express = require('express');
const mongoose = require('mongoose');
const { Turno, ESTADOS_TURNO } = require('../models/Turno');
const ObraSocial = require('../models/ObraSocial');
const auth = require('../middlewares/auth');

const router = express.Router();

const ESTADOS_VISIBLES = ['solicitado', 'confirmado'];

const esObjectIdValido = valor => mongoose.Types.ObjectId.isValid(valor);

const buildFiltro = ({ estado, desde, hasta }) => {
  const filtro = {};

  if (estado) {
    if (!ESTADOS_TURNO.includes(estado)) {
      return { error: 'Estado inválido' };
    }
    filtro.estado = estado;
  }

  if (desde || hasta) {
    filtro.fechaHora = {};
  }

  if (desde) {
    const fechaDesde = new Date(desde);
    if (Number.isNaN(fechaDesde.getTime())) {
      return { error: 'Parámetro "desde" inválido' };
    }
    filtro.fechaHora.$gte = fechaDesde;
  }

  if (hasta) {
    const fechaHasta = new Date(hasta);
    if (Number.isNaN(fechaHasta.getTime())) {
      return { error: 'Parámetro "hasta" inválido' };
    }
    filtro.fechaHora.$lte = fechaHasta;
  }

  return { filtro };
};

const validarPayloadTurno = ({ nombre, apellido, email, telefono, fechaHora }) => {
  if (!nombre || !apellido || !email || !telefono || !fechaHora) {
    return 'Todos los campos obligatorios deben completarse';
  }

  if (!nombre.toString().trim() || !apellido.toString().trim() || !email.toString().trim() || !telefono.toString().trim()) {
    return 'Los datos del paciente no pueden estar vacíos';
  }

  const fecha = new Date(fechaHora);
  if (Number.isNaN(fecha.getTime())) {
    return 'La fecha y hora proporcionadas no son válidas';
  }

  if (fecha < new Date()) {
    return 'La fecha del turno debe ser futura';
  }

  return null;
};

router.get('/', auth(['medico', 'secretaria', 'admin']), async (req, res) => {
  const { filtro, error } = buildFiltro(req.query);

  if (error) {
    return res.status(400).json({ message: error });
  }

  try {
    const turnos = await Turno.find(filtro)
      .populate('obraSocial')
      .sort({ fechaHora: 1 });

    return res.json(turnos);
  } catch (err) {
    return res.status(500).json({ message: 'Error al obtener los turnos' });
  }
});

router.get('/disponibles', async (req, res) => {
  const semanasSolicitadas = parseInt(req.query.semanas, 10);
  const duracionSolicitada = parseInt(req.query.duracion, 10);

  const semanas = Math.min(Math.max(semanasSolicitadas || 2, 1), 8);
  const duracion = Math.min(Math.max(duracionSolicitada || 30, 15), 120);

  const ahora = new Date();
  ahora.setSeconds(0, 0);
  const inicio = new Date(ahora);
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + semanas * 7);

  try {
    const turnosExistentes = await Turno.find({
      fechaHora: { $gte: inicio, $lt: fin },
      estado: { $in: ESTADOS_VISIBLES }
    }).select('fechaHora');

    const ocupados = new Set(turnosExistentes.map(t => t.fechaHora.toISOString()));

    const diasHabiles = [1, 2, 3, 4, 5]; // lunes a viernes
    const horaInicio = 9;
    const horaFin = 17; // 17 excluye último horario

    const cupos = [];

    for (let dia = new Date(inicio); dia < fin; dia.setDate(dia.getDate() + 1)) {
      const diaActual = new Date(dia);
      const diaSemana = diaActual.getDay();

      if (!diasHabiles.includes(diaSemana)) {
        continue;
      }

      const primerHorario = new Date(diaActual);
      primerHorario.setHours(horaInicio, 0, 0, 0);

      const finDelDia = new Date(diaActual);
      finDelDia.setHours(horaFin, 0, 0, 0);

      for (let slot = new Date(primerHorario); slot < finDelDia; slot = new Date(slot.getTime() + duracion * 60000)) {
        if (slot <= ahora) {
          continue;
        }

        const clave = slot.toISOString();
        if (!ocupados.has(clave)) {
          cupos.push(clave);
        }
      }
    }

    return res.json({
      desde: inicio.toISOString(),
      hasta: fin.toISOString(),
      duracionMinutos: duracion,
      cupos
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al calcular la disponibilidad' });
  }
});

router.post('/', async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    telefono,
    obraSocialId,
    fechaHora,
    motivo
  } = req.body;

  const errorValidacion = validarPayloadTurno({ nombre, apellido, email, telefono, fechaHora });
  if (errorValidacion) {
    return res.status(400).json({ message: errorValidacion });
  }

  if (obraSocialId && !esObjectIdValido(obraSocialId)) {
    return res.status(400).json({ message: 'Identificador de obra social inválido' });
  }

  const fecha = new Date(fechaHora);
  const datosPaciente = {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    email: email.toLowerCase().trim(),
    telefono: telefono.trim()
  };

  try {
    if (obraSocialId) {
      const obraSocial = await ObraSocial.findById(obraSocialId);
      if (!obraSocial) {
        return res.status(404).json({ message: 'La obra social indicada no existe' });
      }
    }

    const existente = await Turno.findOne({
      fechaHora: fecha,
      estado: { $in: ESTADOS_VISIBLES }
    });

    if (existente) {
      return res.status(409).json({ message: 'Ese horario ya se encuentra reservado' });
    }

    const nuevoTurno = await Turno.create({
      paciente: datosPaciente,
      obraSocial: obraSocialId || undefined,
      fechaHora: fecha,
      motivo
    });

    return res.status(201).json(await nuevoTurno.populate('obraSocial'));
  } catch (error) {
    return res.status(500).json({ message: 'Error al solicitar el turno' });
  }
});

router.patch('/:id', auth(['medico', 'secretaria', 'admin']), async (req, res) => {
  const {
    estado,
    fechaHora,
    notasInternas,
    motivo,
    telefono,
    email,
    nombre,
    apellido,
    obraSocialId
  } = req.body;

  const set = {};
  const unset = {};

  if (estado) {
    if (!ESTADOS_TURNO.includes(estado)) {
      return res.status(400).json({ message: 'Estado de turno inválido' });
    }
    set.estado = estado;
  }

  if (motivo !== undefined) {
    set.motivo = motivo;
  }

  if (notasInternas !== undefined) {
    set.notasInternas = notasInternas;
  }

  if (telefono) {
    set['paciente.telefono'] = telefono.trim();
  }
  if (email) {
    set['paciente.email'] = email.toLowerCase().trim();
  }
  if (nombre) {
    set['paciente.nombre'] = nombre.trim();
  }
  if (apellido) {
    set['paciente.apellido'] = apellido.trim();
  }

  if (fechaHora) {
    const nuevaFecha = new Date(fechaHora);
    if (Number.isNaN(nuevaFecha.getTime()) || nuevaFecha < new Date()) {
      return res.status(400).json({ message: 'La nueva fecha de turno es inválida' });
    }

    const ocupado = await Turno.findOne({
      _id: { $ne: req.params.id },
      fechaHora: nuevaFecha,
      estado: { $in: ESTADOS_VISIBLES }
    });

    if (ocupado) {
      return res.status(409).json({ message: 'El nuevo horario ya está reservado' });
    }

    set.fechaHora = nuevaFecha;
  }

  if (obraSocialId !== undefined) {
    if (obraSocialId && !esObjectIdValido(obraSocialId)) {
      return res.status(400).json({ message: 'Identificador de obra social inválido' });
    }

    if (obraSocialId) {
      const obra = await ObraSocial.findById(obraSocialId);
      if (!obra) {
        return res.status(404).json({ message: 'La obra social indicada no existe' });
      }
      set.obraSocial = obraSocialId;
    } else {
      unset.obraSocial = 1;
    }
  }

  const update = {};
  if (Object.keys(set).length > 0) {
    update.$set = set;
  }
  if (Object.keys(unset).length > 0) {
    update.$unset = unset;
  }

  if (Object.keys(update).length === 0) {
    return res.status(400).json({ message: 'No se recibieron datos para actualizar' });
  }

  try {
    const turnoActualizado = await Turno.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).populate('obraSocial');

    if (!turnoActualizado) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    return res.json(turnoActualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el turno' });
  }
});

router.delete('/:id', auth(['medico', 'secretaria', 'admin']), async (req, res) => {
  try {
    const turnoCancelado = await Turno.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelado' },
      { new: true }
    );

    if (!turnoCancelado) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    return res.json({ message: 'Turno cancelado', turno: turnoCancelado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cancelar el turno' });
  }
});

module.exports = router;
