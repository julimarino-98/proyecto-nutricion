import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Formulario.css'; // Asegúrate que este archivo exista en la misma carpeta

const API_URL = 'http://localhost:5001/api';

function Formulario() {
  const [formData, setFormData] = useState({
    nombreApellido: '',
    nombrePaciente: '',
    telefono: '',
    email: '',
    obraSocial: '',
  });
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Obras Sociales desde la API
  const [obrasSocialesList, setObrasSocialesList] = useState([]);
  const [loadingObrasSociales, setLoadingObrasSociales] = useState(true);

  // Cargar Obras Sociales
  useEffect(() => {
    const fetchObrasSociales = async () => {
      try {
        const response = await fetch(`${API_URL}/obrassociales`);
        if (!response.ok) throw new Error('Error al cargar obras sociales');
        const data = await response.json();
        setObrasSocialesList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingObrasSociales(false);
      }
    };
    fetchObrasSociales();
  }, []); 

  // Simulación de horarios (próximo paso: conectar a API)
  useEffect(() => {
    if (selectedDate) {
      console.log(`Buscando turnos para: ${selectedDate.toLocaleDateString()}`);
      const exampleTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      setAvailableTimes(exampleTimes);
      setSelectedTime('');
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cita Solicitada:', {
      ...formData,
      fecha: selectedDate.toLocaleDateString(),
      hora: selectedTime,
    });
    setSubmitted(true);
  };
  
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 14);

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
                      onChange={setSelectedDate}
                      minDate={minDate}
                      maxDate={maxDate}
                      className="react-calendar-override" 
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
                        <p className="text-center mt-3">No hay horarios disponibles para este día.</p>
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
              {step === 2 && (
                <div className="booking-step">
                  <h4 className="text-center">2. Completa tus datos</h4>
                  <p className="text-center text-muted">
                    Turno para el {selectedDate?.toLocaleDateString()} a las {selectedTime} hs.
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
                      <Form.Select name="obraSocial" onChange={handleInputChange} required disabled={loadingObrasSociales}>
                        <option value="">{loadingObrasSociales ? 'Cargando...' : 'Selecciona una opción...'}</option>
                        {obrasSocialesList.map(os => (
                          <option key={os._id} value={os.nombre}>{os.nombre}</option>
                        ))}
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