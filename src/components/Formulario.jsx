import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Formulario.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const timeFormatter = new Intl.DateTimeFormat('es-AR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

const esMismoDia = (fechaA, fechaB) => (
  fechaA.getFullYear() === fechaB.getFullYear()
  && fechaA.getMonth() === fechaB.getMonth()
  && fechaA.getDate() === fechaB.getDate()
);

const dividirNombreCompleto = (valor) => {
  const limpio = valor?.trim();
  if (!limpio) {
    return ['Paciente', 'Sin datos'];
  }

  const partes = limpio.split(/\s+/);
  const nombre = partes.shift() || 'Paciente';
  const apellido = partes.length ? partes.join(' ') : 'Sin datos';
  return [nombre, apellido];
};

function Formulario() {
  const [formData, setFormData] = useState({
    solicitante: '',
    nombrePaciente: '',
    telefono: '',
    email: '',
    obraSocial: '',
    motivo: ''
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [turnoCreado, setTurnoCreado] = useState(null);

  const [obrasSocialesList, setObrasSocialesList] = useState([]);
  const [loadingObrasSociales, setLoadingObrasSociales] = useState(true);
  const [obrasError, setObrasError] = useState('');

  useEffect(() => {
    const fetchObrasSociales = async () => {
      try {
        setObrasError('');
        const response = await fetch(`${API_URL}/obrassociales`);
        if (!response.ok) {
          throw new Error('No pudimos cargar las obras sociales');
        }
        const data = await response.json();
        setObrasSocialesList(data);
      } catch (error) {
        console.error(error);
        setObrasError(error.message);
      } finally {
        setLoadingObrasSociales(false);
      }
    };

    fetchObrasSociales();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return undefined;
    }

    const controller = new AbortController();

    const cargarDisponibilidad = async () => {
      try {
        setIsLoadingTimes(true);
        setAvailabilityError('');
        const response = await fetch(`${API_URL}/turnos/disponibles?semanas=2&duracion=60`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('No pudimos consultar la disponibilidad.');
        }

        const data = await response.json();
        const diaSeleccionado = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );

        const slots = data.cupos
          .map(cupo => new Date(cupo))
          .filter(cupo => esMismoDia(cupo, diaSeleccionado))
          .map(cupo => ({
            iso: cupo.toISOString(),
            label: timeFormatter.format(cupo)
          }));

        setAvailableTimes(slots);
        setSelectedSlot(null);
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error(error);
        setAvailabilityError(error.message);
        setAvailableTimes([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTimes(false);
        }
      }
    };

    cargarDisponibilidad();

    return () => controller.abort();
  }, [selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep(1);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 14);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const [nombrePaciente, apellidoPaciente] = dividirNombreCompleto(formData.nombrePaciente);
    const comentarioAdicional = [
      formData.solicitante.trim() ? `Solicitante: ${formData.solicitante.trim()}` : '',
      formData.motivo.trim()
    ].filter(Boolean).join(' | ');

    const payload = {
      nombre: nombrePaciente,
      apellido: apellidoPaciente,
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      obraSocialId: formData.obraSocial || undefined,
      fechaHora: selectedSlot.iso,
      motivo: comentarioAdicional || undefined
    };

    try {
      const response = await fetch(`${API_URL}/turnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'No se pudo solicitar el turno');
      }

      const turno = await response.json();
      setTurnoCreado(turno);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="turno" className="booking-section">
      <Container>
        <h2 className="text-center fw-bold mb-5">Agenda tu Turno</h2>
        {!submitted ? (
          <Row className="justify-content-center">
            <Col md={8} lg={7}>
              {step === 1 && (
                <div className="booking-step">
                  <h4 className="text-center">1. Selecciona un día y horario</h4>
                  <div className="calendar-wrapper">
                    <Calendar
                      value={selectedDate}
                      onChange={handleDateChange}
                      minDate={minDate}
                      maxDate={maxDate}
                      className="react-calendar-override"
                    />
                  </div>
                  {selectedDate && (
                    <div className="time-slots">
                      {isLoadingTimes && (
                        <div className="text-center w-100">
                          <Spinner animation="border" size="sm" />
                          <p className="mt-2 mb-0">Buscando horarios disponibles...</p>
                        </div>
                      )}
                      {!isLoadingTimes && availabilityError && (
                        <Alert variant="danger" className="w-100 text-center">
                          {availabilityError}
                        </Alert>
                      )}
                      {!isLoadingTimes && !availabilityError && availableTimes.length === 0 && (
                        <p className="text-center w-100">
                          No hay horarios disponibles para esta fecha.
                        </p>
                      )}
                      {!isLoadingTimes && availableTimes.map(slot => (
                        <Button
                          key={slot.iso}
                          variant={selectedSlot?.iso === slot.iso ? 'primary' : 'outline-primary'}
                          className="time-slot-btn"
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="text-center mt-4">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedDate || !selectedSlot || isLoadingTimes}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="booking-step">
                  <h4 className="text-center">2. Completa tus datos</h4>
                  <p className="text-center text-muted">
                    Turno para el {selectedDate?.toLocaleDateString()} a las {selectedSlot?.label} hs.
                  </p>
                  {formError && (
                    <Alert variant="danger">{formError}</Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tu Nombre y Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="solicitante"
                        value={formData.solicitante}
                        onChange={handleInputChange}
                        placeholder="¿Quién solicita el turno?"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre y Apellido del Paciente</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombrePaciente"
                        value={formData.nombrePaciente}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono de Contacto</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                        inputMode="tel"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Obra Social</Form.Label>
                      <Form.Select
                        name="obraSocial"
                        value={formData.obraSocial}
                        onChange={handleInputChange}
                        required
                        disabled={loadingObrasSociales}
                      >
                        <option value="">
                          {loadingObrasSociales ? 'Cargando...' : 'Selecciona una opción...'}
                        </option>
                        {obrasSocialesList.map(os => (
                          <option key={os._id} value={os._id}>{os.nombre}</option>
                        ))}
                      </Form.Select>
                      {obrasError && (
                        <small className="text-danger">{obrasError}</small>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Notas para el profesional (opcional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleInputChange}
                        placeholder="Motivo de la consulta, datos relevantes, etc."
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button variant="secondary" onClick={() => setStep(1)}>Volver</Button>
                      <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Confirmar Cita'}
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </Col>
          </Row>
        ) : (
          <Alert variant="success" className="text-center">
            <h5>¡Gracias! Tu solicitud fue enviada.</h5>
            <p>
              Revisá tu correo ({turnoCreado?.paciente.email}) para ver el resumen del turno.
              Te avisaremos nuevamente cuando sea confirmado o si debemos reprogramarlo.
            </p>
          </Alert>
        )}
      </Container>
    </section>
  );
}

export default Formulario;
