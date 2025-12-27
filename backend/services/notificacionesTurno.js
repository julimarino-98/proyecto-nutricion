const { sendEmail, isConfigured } = require('./emailService');

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'full',
  timeStyle: 'short'
});

const formatDate = (fechaISO) => dateTimeFormatter.format(new Date(fechaISO));

const buildResumenHtml = (turno) => {
  const partes = [
    `<li><strong>Fecha:</strong> ${formatDate(turno.fechaHora)}</li>`,
    `<li><strong>Paciente:</strong> ${turno.paciente.nombre} ${turno.paciente.apellido}</li>`,
    `<li><strong>Teléfono:</strong> ${turno.paciente.telefono}</li>`,
    `<li><strong>Correo:</strong> ${turno.paciente.email}</li>`
  ];

  if (turno.obraSocial) {
    partes.push(`<li><strong>Obra social:</strong> ${turno.obraSocial.nombre}</li>`);
  }

  if (turno.motivo) {
    partes.push(`<li><strong>Motivo:</strong> ${turno.motivo}</li>`);
  }

  return `<ul>${partes.join('')}</ul>`;
};

const buildResumenPlano = (turno) => {
  const partes = [
    `Fecha: ${formatDate(turno.fechaHora)}`,
    `Paciente: ${turno.paciente.nombre} ${turno.paciente.apellido}`,
    `Teléfono: ${turno.paciente.telefono}`,
    `Correo: ${turno.paciente.email}`
  ];

  if (turno.obraSocial) {
    partes.push(`Obra social: ${turno.obraSocial.nombre}`);
  }

  if (turno.motivo) {
    partes.push(`Motivo: ${turno.motivo}`);
  }

  return partes.join('\n');
};

const notificarSolicitudTurno = async (turno) => {
  if (!isConfigured()) {
    return;
  }

  await sendEmail({
    to: turno.paciente.email,
    subject: 'Recibimos tu solicitud de turno',
    html: `
      <p>Hola ${turno.paciente.nombre},</p>
      <p>¡Gracias por contactarte! Registramos tu solicitud y en breve confirmaremos la disponibilidad.</p>
      ${buildResumenHtml(turno)}
      <p>Te enviaremos un correo cuando el turno se confirme o si necesitamos reprogramarlo.</p>
    `,
    text: `Hola ${turno.paciente.nombre}.
Recibimos tu solicitud de turno.
${buildResumenPlano(turno)}
Te avisaremos cuando se confirme.`
  });
};

const notificarCambioEstado = async (turno) => {
  if (!isConfigured()) {
    return;
  }

  if (!['confirmado', 'cancelado'].includes(turno.estado)) {
    return;
  }

  const esConfirmado = turno.estado === 'confirmado';
  const subject = esConfirmado ? '¡Tu turno fue confirmado!' : 'Actualización sobre tu turno';
  const mensajePrincipal = esConfirmado
    ? 'Confirmamos tu turno. Te esperamos en el día y horario indicados.'
    : 'El turno fue cancelado. Si necesitás solicitar uno nuevo, podés hacerlo desde la web.';

  await sendEmail({
    to: turno.paciente.email,
    subject,
    html: `
      <p>Hola ${turno.paciente.nombre},</p>
      <p>${mensajePrincipal}</p>
      ${buildResumenHtml(turno)}
      <p>Ante cualquier duda podés responder este correo.</p>
    `,
    text: `Hola ${turno.paciente.nombre}.
${mensajePrincipal}
${buildResumenPlano(turno)}
`
  });
};

module.exports = {
  notificarSolicitudTurno,
  notificarCambioEstado
};
