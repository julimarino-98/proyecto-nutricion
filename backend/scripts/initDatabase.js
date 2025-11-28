const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/Usuario');
const ObraSocial = require('../models/ObraSocial');
const { Turno } = require('../models/Turno');

const MONGO_URI = process.env.MONGO_URI;

const adminEmail = process.env.INIT_ADMIN_EMAIL || 'admin@nutri.com';
const adminPassword = process.env.INIT_ADMIN_PASSWORD || 'cambiar123';
const adminName = process.env.INIT_ADMIN_NAME || 'Admin Nutri';

if (!MONGO_URI) {
  console.error('Falta configurar MONGO_URI en backend/.env');
  process.exit(1);
}

async function ensureConnection() {
  await mongoose.connect(MONGO_URI);
  await Promise.all([Usuario.init(), ObraSocial.init(), Turno.init()]);
}

async function ensureAdmin() {
  const existente = await Usuario.findOne({ email: adminEmail.toLowerCase() });
  if (existente) {
    console.log(`Usuario admin ya existente: ${existente.email}`);
    return existente;
  }

  const passwordHasheada = await bcrypt.hash(adminPassword, 10);
  const nuevoAdmin = await Usuario.create({
    nombre: adminName,
    email: adminEmail.toLowerCase(),
    password: passwordHasheada,
    rol: 'admin'
  });

  console.log(`Usuario admin creado: ${nuevoAdmin.email}`);
  return nuevoAdmin;
}

async function seedObrasSociales() {
  const obrasBase = ['Particular', 'Medifé', 'Swiss Medical'];
  const existentes = await ObraSocial.find({ nombre: { $in: obrasBase } }).select('nombre');
  const nombresExistentes = new Set(existentes.map(o => o.nombre));

  const porCrear = obrasBase.filter(nombre => !nombresExistentes.has(nombre));
  if (porCrear.length === 0) {
    console.log('Obras sociales base ya presentes');
    return;
  }

  await ObraSocial.insertMany(porCrear.map(nombre => ({ nombre })));
  console.log(`Obras sociales cargadas: ${porCrear.join(', ')}`);
}

async function main() {
  try {
    await ensureConnection();
    await ensureAdmin();
    await seedObrasSociales();
    console.log('Inicialización completa. Puedes iniciar el backend con npm run dev');
  } catch (error) {
    console.error('Error durante la inicialización de la base de datos:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
