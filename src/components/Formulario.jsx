// src/components/Booking.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Formulario.css';

function Formulario() {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombreApellido: '',
    nombrePaciente: '',
    telefono: '',
    email: '',
    obraSocial: '',
  });

  // Estado para la lógica del calendario y turnos
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  
  // Estado para controlar el flujo del formulario
  const [step, setStep] = useState(1); // 1: Calendario, 2: Datos personales
  const [submitted, setSubmitted] = useState(false);

  // --- SIMULACIÓN DE DATOS (esto vendrá del backend en el futuro) ---
  const obrasSocialesList = ['OSDE', 'Swiss Medical', 'Galeno', 'Medifé', 'Particular'];

  // Simula la búsqueda de horarios disponibles cuando cambia la fecha
  useEffect(() => {
    if (selectedDate) {
      console.log(`Buscando turnos para: ${selectedDate.toLocaleDateString()}`);
      const exampleTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      setAvailableTimes(exampleTimes);
      setSelectedTime('');
    }
  }, [selectedDate]);
  // --- FIN DE LA SIMULACIÓN ---

  // Manejador para los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejador para la sumisión final del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cita Solicitada:', {
      ...formData,
      fecha: selectedDate.toLocaleDateString(),
      hora: selectedTime,
    });
    setSubmitted(true);
  };
  
  // Limita el calendario a las próximas 2 semanas
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 14);

  return (
    <section id="turno" className="booking-section">
      <Container>
        <h2 className="text-center fw-bold mb-5">Agenda tu Turno</h2>

        {!submitted ? (
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              {/* PASO 1: SELECCIÓN DE FECHA Y HORA */}
              {step === 1 && (
                <div className="booking-step">
                  <h4 className="text-center">1. Selecciona un día y horario</h4>
                  <div className="datepicker-container">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={minDate}
                      maxDate={maxDate}
                      inline
                    />
                  </div>
                  {selectedDate && (
                    <div className="time-slots">
                      {availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'primary' : 'outline-primary'}
                            className="time-slot-btn"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p>No hay horarios disponibles para este día.</p>
                      )}
                    </div>
                  )}
                  <div className="text-center mt-4">
                    <Button onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}>
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}

              {/* PASO 2: DATOS PERSONALES */}
              {step === 2 && (
                <div className="booking-step">
                  <h4 className="text-center">2. Completa tus datos</h4>
                  <p className="text-center text-muted">
                    Turno para el {selectedDate.toLocaleDateString()} a las {selectedTime} hs.
                  </p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tu Nombre y Apellido</Form.Label>
                      <Form.Control type="text" name="nombreApellido" onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre y Apellido del Paciente</Form.Label>
                      <Form.Control type="text" name="nombrePaciente" onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono de Contacto</Form.Label>
                      <Form.Control type="tel" name="telefono" onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control type="email" name="email" onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Obra Social</Form.Label>
                      <Form.Select name="obraSocial" onChange={handleInputChange} required>
                        <option value="">Selecciona una opción...</option>
                        {obrasSocialesList.map(os => <option key={os} value={os}>{os}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <Button variant="secondary" onClick={() => setStep(1)}>Volver</Button>
                      <Button variant="primary" type="submit">Confirmar Cita</Button>
                    </div>
                  </Form>
                </div>
              )}
            </Col>
          </Row>
        ) : (
          /* MENSAJE DE ÉXITO */
          <Alert variant="success" className="text-center">
            <h5>¡Gracias! Tu cita ha sido solicitada.</h5>
            <p>Recibirás un correo electrónico de notificación en breve y otro cuando la cita sea confirmada. ¡Muchas gracias!</p>
          </Alert>
        )}
      </Container>
    </section>
  );
}

export default Formulario;