import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
// --- ¡CORRECCIÓN! ---
// Quitamos la extensión .jsx para que el importador de React lo resuelva.
import { useAuth } from '../context/AuthContext'; 
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import './AdminDashboard.css';

// Definimos la URL de nuestra API del backend
const API_URL = 'http://localhost:5001/api';

// DATOS DE EJEMPLO (Solo dejamos los de turnos por ahora)
const sampleAppointments = [
  { id: 1, patientName: 'Ana García', date: '2025-09-25', time: '10:00', socialInsurance: 'OSDE', status: 'pending' },
  { id: 2, patientName: 'Juan Pérez', date: '2025-09-25', time: '11:00', socialInsurance: 'Swiss Medical', status: 'pending' },
  { id: 3, patientName: 'María López', date: '2025-09-26', time: '14:00', socialInsurance: 'Particular', status: 'confirmed' },
  { id: 4, patientName: 'Carlos Ruiz', date: '2025-09-27', time: '09:00', socialInsurance: 'Galeno', status: 'canceled' },
];


function AdminDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState(sampleAppointments); 

  // El estado de obras sociales ahora empieza vacío
  const [socialInsurances, setSocialInsurances] = useState([]);

  // Estados para el modal de Obras Sociales
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentInsurance, setCurrentInsurance] = useState(null);
  const [newInsuranceName, setNewInsuranceName] = useState('');
  const [error, setError] = useState(''); // Para mostrar errores de la API

  
  // --- Cargar Obras Sociales desde la API ---
  const fetchSocialInsurances = async () => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/obrassociales`);
      if (!response.ok) {
        throw new Error('Error al cargar obras sociales');
      }
      const data = await response.json();
      setSocialInsurances(data); 
    } catch (err) {
      console.error('Error fetching obras sociales:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSocialInsurances(); // Carga las obras sociales cuando el componente se monta
  }, []); // El array vacío [] significa que esto se ejecuta 1 vez


  // Lógica para filtrar turnos por estado (sin cambios)
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const canceledAppointments = appointments.filter(a => a.status === 'canceled');
  
  // --- Funciones para Turnos (simuladas, sin cambios) ---
  const handleConfirmAppointment = (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
    alert(`Turno ID: ${id} confirmado.`);
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'canceled' } : a));
    alert(`Turno ID: ${id} cancelado.`);
  };

  // --- Funciones para el Modal de Obras Sociales (¡ACTUALIZADAS!) ---
  const handleShowModal = (mode, insurance = null) => {
    setModalMode(mode);
    setCurrentInsurance(insurance);
    setNewInsuranceName(insurance ? insurance.name : '');
    setError(''); 
    setShowModal(true);
  };
  
  const handleCloseModal = () => setShowModal(false);

  // ¡Esta función ahora habla con la API!
  const handleSaveInsurance = async () => {
    if (!newInsuranceName) {
      setError('El nombre no puede estar vacío');
      return;
    }

    try {
      setError(''); 
      let response;
      if (modalMode === 'add') {
        // MODO AGREGAR (POST)
        response = await fetch(`${API_URL}/obrassociales`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: newInsuranceName }),
        });
      } else {
        // MODO EDITAR (PUT)
        response = await fetch(`${API_URL}/obrassociales/${currentInsurance._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: newInsuranceName }),
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error al guardar');
      }

      handleCloseModal(); 
      fetchSocialInsurances(); // ¡Recarga la lista desde la DB!

    } catch (err) {
      console.error('Error saving insurance:', err);
      setError(err.message); 
    }
  };
  
  // ¡Esta función ahora habla con la API!
  const handleDeleteInsurance = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta obra social?')) {
      try {
        setError(''); 
        const response = await fetch(`${API_URL}/obrassociales/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Error al eliminar');
        }

        fetchSocialInsurances(); // ¡Recarga la lista desde la DB!

      } catch (err) {
        console.error('Error deleting insurance:', err);
        setError(err.message); 
      }
    }
  };


  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Administracion de Turnos y Obras Sociales</h1>
          {user && <p className="lead">Bienvenida, {user.name}!</p>}
        </div>
        <Button variant="outline-danger" onClick={logout}>Cerrar Sesión</Button>
      </div>

      <Tabs defaultActiveKey="appointments" id="admin-dashboard-tabs" className="mb-3">
        {/* PESTAÑA PRINCIPAL DE TURNOS */}
        <Tab eventKey="appointments" title="Gestión de Turnos">
          <Tabs defaultActiveKey="pending" id="appointments-status-tabs">
            <Tab eventKey="pending" title={`A confirmar (${pendingAppointments.length})`}>
              <Table striped bordered hover responsive>
                <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Obra Social</th><th>Acciones</th></tr></thead>
                <tbody>
                  {pendingAppointments.map(app => (
                    <tr key={app.id}>
                      <td>{app.patientName}</td><td>{app.date}</td><td>{app.time}</td><td>{app.socialInsurance}</td>
                      <td>
                        <Button variant="success" size="sm" onClick={() => handleConfirmAppointment(app.id)}>Confirmar</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleCancelAppointment(app.id)}>Cancelar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="confirmed" title={`Confirmados (${confirmedAppointments.length})`}>
              <Table striped bordered hover responsive>
                 <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Obra Social</th></tr></thead>
                 <tbody>{confirmedAppointments.map(app => (<tr key={app.id}><td>{app.patientName}</td><td>{app.date}</td><td>{app.time}</td><td>{app.socialInsurance}</td></tr>))}</tbody>
              </Table>
            </Tab>
            <Tab eventKey="canceled" title={`Cancelados (${canceledAppointments.length})`}>
              <Table striped bordered hover responsive>
                 <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Obra Social</th></tr></thead>
                 <tbody>{canceledAppointments.map(app => (<tr key={app.id}><td>{app.patientName}</td><td>{app.date}</td><td>{app.time}</td><td>{app.socialInsurance}</td></tr>))}</tbody>
              </Table>
            </Tab>
          </Tabs>
        </Tab>
        
        {/* PESTAÑA PRINCIPAL DE OBRAS SOCIALES (¡CONECTADA!) */}
        <Tab eventKey="socialInsurances" title="Obras Sociales">
          <Button variant="primary" onClick={() => handleShowModal('add')} className="mb-3">
            <PlusCircle className="me-2" />
            Agregar Nueva Obra Social
          </Button>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover responsive>
            <thead><tr><th>Nombre</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {socialInsurances.map(si => (
                <tr key={si._id}>
                  <td>{si.name}</td>
                  <td className="text-end">
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowModal('edit', si)}><PencilSquare /></Button>{' '}
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteInsurance(si._id)}><Trash /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* MODAL PARA AGREGAR/EDITAR OBRAS SOCIALES (¡CONECTADO!) */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Agregar Obra Social' : 'Editar Obra Social'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>Nombre de la Obra Social</Form.Label>
              {/* --- ¡AQUÍ ESTÁ LA CORRECCIÓN! --- */}
              <Form.Control type="text" value={newInsuranceName} onChange={(e) => setNewInsuranceName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveInsurance}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default AdminDashboard;