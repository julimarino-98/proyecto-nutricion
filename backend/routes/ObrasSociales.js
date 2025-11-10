const express = require('express');
const ObraSocial = require('../models/ObraSocial');
const auth = require('../middlewares/auth');

const router = express.Router();

// 1. OBTENER TODAS las obras sociales (GET)
router.get('/', async (req, res) => {
  try {
    const obrasSociales = await ObraSocial.find().sort({ nombre: 1 });
    res.json(obrasSociales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las obras sociales' });
  }
});

// 2. CREAR una nueva obra social (POST)
router.post('/', auth(['medico', 'secretaria', 'admin']), async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'El campo nombre es requerido' });
  }

  const nuevaObraSocial = new ObraSocial({ nombre });
  try {
    const obraSocialGuardada = await nuevaObraSocial.save();
    res.status(201).json(obraSocialGuardada);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una obra social con ese nombre' });
    }
    res.status(500).json({ message: 'Error al crear la obra social' });
  }
});

// 3. EDITAR una obra social existente (PUT)
router.put('/:id', auth(['medico', 'secretaria', 'admin']), async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: 'El campo nombre es requerido' });
  }
  try {
    const obraSocialActualizada = await ObraSocial.findByIdAndUpdate(
      req.params.id,
      { nombre: nombre },
      { new: true, runValidators: true }
    );
    if (!obraSocialActualizada) return res.status(404).json({ message: 'Obra social no encontrada' });
    res.json(obraSocialActualizada);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una obra social con ese nombre' });
    }
    res.status(500).json({ message: 'Error al editar la obra social' });
  }
});

// 4. ELIMINAR una obra social (DELETE)
router.delete('/:id', auth(['medico', 'secretaria', 'admin']), async (req, res) => {
  try {
    const obraSocialEliminada = await ObraSocial.findByIdAndDelete(req.params.id);
    if (!obraSocialEliminada) return res.status(404).json({ message: 'Obra social no encontrada' });
    res.json({ message: 'Obra social eliminada', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la obra social' });
  }
});

module.exports = router;
