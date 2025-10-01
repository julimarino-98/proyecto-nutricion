import React, { useState } from 'react';
import { Container, Tabs, Tab, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import './AdminDashboard.css';

// --- DATOS DE EJEMPLO (en el futuro vendrán de una base de datos) ---
const sampleAppointments = [
  { id: 1, patientName: 'Ana García', date: '2025-09-25', time: '10:00', socialInsurance: 'OSDE', status: 'pending' },
  { id: 2, patientName: 'Juan Pérez', date: '2025-09-25', time: '11:00', socialInsurance: 'Swiss Medical', status: 'pending' },
  { id: 3, patientName: 'María López', date: '2025-09-26', time: '14:00', socialInsurance: 'Particular', status: 'confirmed' },
  { id: 4, patientName: 'Carlos Ruiz', date: '2025-09-27', time: '09:00', socialInsurance: 'Galeno', status: 'canceled' },
];

const sampleSocialInsurances = [
  { id: 1, name: 'OSDE' },
  { id: 2, name: 'Swiss Medical' },
  { id: 3, name: 'Galeno' },
  { id: 4, name: 'Medifé' },
  { id: 5, name: 'Particular' },
];
// --- FIN DE DATOS DE EJEMPLO ---


function AdminDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [socialInsurances, setSocialInsurances] = useState(sampleSocialInsurances);

  // Estados para el modal de Obras Sociales
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentInsurance, setCurrentInsurance] = useState(null);
  const [newInsuranceName, setNewInsuranceName] = useState('');

  // Lógica para filtrar turnos por estado
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const canceledAppointments = appointments.filter(a => a.status === 'canceled');
  
  // --- Funciones para Turnos (simuladas) ---
  const handleConfirmAppointment = (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
    alert(`Turno ID: ${id} confirmado.`);
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'canceled' } : a));
    alert(`Turno ID: ${id} cancelado.`);
  };

  // --- Funciones para el Modal de Obras Sociales ---
  const handleShowModal = (mode, insurance = null) => {
    setModalMode(mode);
    setCurrentInsurance(insurance);
    setNewInsuranceName(insurance ? insurance.name : '');
    setShowModal(true);
  };
  
  const handleCloseModal = () => setShowModal(false);

  const handleSaveInsurance = () => {
    if (modalMode === 'add') {
      const newInsurance = { id: Date.now(), name: newInsuranceName };
      setSocialInsurances([...socialInsurances, newInsurance]);
    } else {
      setSocialInsurances(socialInsurances.map(si => si.id === currentInsurance.id ? { ...si, name: newInsuranceName } : si));
    }
    handleCloseModal();
  };
  
  const handleDeleteInsurance = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta obra social?')) {
      setSocialInsurances(socialInsurances.filter(si => si.id !== id));
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
        
        {/* PESTAÑA PRINCIPAL DE OBRAS SOCIALES */}
        <Tab eventKey="socialInsurances" title="Obras Sociales">
          <Button variant="primary" onClick={() => handleShowModal('add')} className="mb-3">
            <PlusCircle className="me-2" />
            Agregar Nueva Obra Social
          </Button>
          <Table striped bordered hover responsive>
            <thead><tr><th>Nombre</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {socialInsurances.map(si => (
                <tr key={si.id}>
                  <td>{si.name}</td>
                  <td className="text-end">
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowModal('edit', si)}><PencilSquare /></Button>{' '}
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteInsurance(si.id)}><Trash /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* MODAL PARA AGREGAR/EDITAR OBRAS SOCIALES */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Agregar Obra Social' : 'Editar Obra Social'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre de la Obra Social</Form.Label>
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