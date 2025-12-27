const EMAIL_PROVIDER_URL = 'https://api.resend.com/emails';

const MAIL_FROM = process.env.MAIL_FROM;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const isConfigured = () => Boolean(MAIL_FROM && RESEND_API_KEY);

const buildBody = ({ to, subject, html, text }) => ({
  from: MAIL_FROM,
  to: Array.isArray(to) ? to : [to],
  subject,
  html,
  text
});

const getFetch = () => {
  if (typeof fetch === 'function') {
    return fetch;
  }
  throw new Error('Fetch API no disponible en esta versión de Node. Actualiza a Node 18 o superior.');
};

const sendEmail = async (options) => {
  if (!isConfigured()) {
    console.warn('Servicio de correos no configurado. Se omite el envío.');
    return;
  }

  const fetchImpl = getFetch();
  const response = await fetchImpl(EMAIL_PROVIDER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildBody(options))
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Error al enviar correo (${response.status}): ${errorBody}`);
  }
};

module.exports = {
  sendEmail,
  isConfigured
};
