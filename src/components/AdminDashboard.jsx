import React, { useState, useEffect, useMemo } from 'react';
import { Container, Tabs, Tab, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import './AdminDashboard.css';

// Definimos la URL de nuestra API del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';


function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const [appointments, setAppointments] = useState([]);

  // El estado de obras sociales ahora empieza vacío
  const [socialInsurances, setSocialInsurances] = useState([]);

  // Estados para el modal de Obras Sociales
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentInsurance, setCurrentInsurance] = useState(null);
  const [newInsuranceName, setNewInsuranceName] = useState('');
  const [insuranceError, setInsuranceError] = useState(''); // Para mostrar errores de la API de obras sociales
  const [appointmentError, setAppointmentError] = useState('');
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat('es-AR'), []);
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }),
    []
  );

  
  // --- Cargar Obras Sociales desde la API ---
  const fetchSocialInsurances = async () => {
    try {
      setInsuranceError('');
      const response = await fetch(`${API_URL}/obrassociales`);
      if (!response.ok) {
        throw new Error('Error al cargar obras sociales');
      }
      const data = await response.json();
      setSocialInsurances(data);
    } catch (err) {
      console.error('Error fetching obras sociales:', err);
      setInsuranceError(err.message);
    }
  };

  const fetchAppointments = async () => {
    if (!token) {
      return;
    }

    try {
      setAppointmentError('');
      setIsLoadingAppointments(true);
      const response = await fetch(`${API_URL}/turnos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al cargar los turnos');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching turnos:', err);
      setAppointmentError(err.message);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchSocialInsurances(); // Carga las obras sociales cuando el componente se monta
  }, []); // El array vacío [] significa que esto se ejecuta 1 vez

  useEffect(() => {
    if (token) {
      fetchAppointments();
    } else {
      setAppointments([]);
      setAppointmentError('');
    }
  }, [token]);


  // Lógica para filtrar turnos por estado (sin cambios)
  const pendingAppointments = appointments.filter(a => a.estado === 'solicitado');
  const confirmedAppointments = appointments.filter(a => a.estado === 'confirmado');
  const canceledAppointments = appointments.filter(a => a.estado === 'cancelado');
  
  // --- Funciones para Turnos (simuladas, sin cambios) ---
  const handleConfirmAppointment = async (id) => {
    if (!token) {
      setAppointmentError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    try {
      setAppointmentError('');
      const response = await fetch(`${API_URL}/turnos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: 'confirmado' }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'No se pudo confirmar el turno');
      }

      const updatedAppointment = await response.json();
      setAppointments(prev => prev.map(a => (a._id === updatedAppointment._id ? updatedAppointment : a)));
    } catch (err) {
      console.error('Error confirming turno:', err);
      setAppointmentError(err.message);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!token) {
      setAppointmentError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    try {
      setAppointmentError('');
      const response = await fetch(`${API_URL}/turnos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: 'cancelado' }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'No se pudo cancelar el turno');
      }

      const updatedAppointment = await response.json();
      setAppointments(prev => prev.map(a => (a._id === updatedAppointment._id ? updatedAppointment : a)));
    } catch (err) {
      console.error('Error cancelling turno:', err);
      setAppointmentError(err.message);
    }
  };

  // --- Funciones para el Modal de Obras Sociales (¡ACTUALIZADAS!) ---
  const handleShowModal = (mode, insurance = null) => {
    setModalMode(mode);
    setCurrentInsurance(insurance);
    setNewInsuranceName(insurance ? insurance.nombre : '');
    setInsuranceError('');
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentInsurance(null);
    setNewInsuranceName('');
  };

  // ¡Esta función ahora habla con la API!
  const handleSaveInsurance = async () => {
    const trimmedName = newInsuranceName.trim();
    if (!trimmedName) {
      setInsuranceError('El nombre no puede estar vacío');
      return;
    }

    if (!token) {
      setInsuranceError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    try {
      setInsuranceError('');
      const body = JSON.stringify({ nombre: trimmedName });
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      let response;
      if (modalMode === 'add') {
        // MODO AGREGAR (POST)
        response = await fetch(`${API_URL}/obrassociales`, {
          method: 'POST',
          headers,
          body,
        });
      } else if (currentInsurance?._id) {
        // MODO EDITAR (PUT)
        response = await fetch(`${API_URL}/obrassociales/${currentInsurance._id}`, {
          method: 'PUT',
          headers,
          body,
        });
      } else {
        throw new Error('No se seleccionó ninguna obra social para editar');
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al guardar la obra social');
      }

      handleCloseModal();
      fetchSocialInsurances(); // ¡Recarga la lista desde la DB!

    } catch (err) {
      console.error('Error saving insurance:', err);
      setInsuranceError(err.message);
    }
  };

  // ¡Esta función ahora habla con la API!
  const handleDeleteInsurance = async (id) => {
    if (!token) {
      setInsuranceError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta obra social?')) {
      try {
        setInsuranceError('');
        const response = await fetch(`${API_URL}/obrassociales/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Error al eliminar la obra social');
        }

        fetchSocialInsurances(); // ¡Recarga la lista desde la DB!

      } catch (err) {
        console.error('Error deleting insurance:', err);
        setInsuranceError(err.message);
      }
    }
  };


  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Administracion de Turnos y Obras Sociales</h1>
          {user && <p className="lead">Bienvenida, {user.nombre || user.name}!</p>}
        </div>
        <Button variant="outline-danger" onClick={logout}>Cerrar Sesión</Button>
      </div>

      <Tabs defaultActiveKey="appointments" id="admin-dashboard-tabs" className="mb-3">
        {/* PESTAÑA PRINCIPAL DE TURNOS */}
        <Tab eventKey="appointments" title="Gestión de Turnos">
          {appointmentError && <Alert variant="danger">{appointmentError}</Alert>}
          {isLoadingAppointments && (
            <div className="mb-3 text-muted">Cargando turnos...</div>
          )}
          <Tabs defaultActiveKey="pending" id="appointments-status-tabs">
            <Tab eventKey="pending" title={`A confirmar (${pendingAppointments.length})`}>
              <Table striped bordered hover responsive>
                <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Obra Social</th><th>Acciones</th></tr></thead>
                <tbody>
                  {pendingAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center">No hay turnos pendientes.</td>
                    </tr>
                  ) : (
                    pendingAppointments.map(app => {
                      const nombre = [app.paciente?.nombre, app.paciente?.apellido]
                        .filter(Boolean)
                        .join(' ') || 'Sin datos';
                      const fecha = app.fechaHora ? dateFormatter.format(new Date(app.fechaHora)) : 'Sin fecha';
                      const hora = app.fechaHora ? timeFormatter.format(new Date(app.fechaHora)) : '--';
                      const obra = app.obraSocial?.nombre || 'Particular';

                      return (
                        <tr key={app._id}>
                          <td>{nombre}</td>
                          <td>{fecha}</td>
                          <td>{hora}</td>
                          <td>{obra}</td>
                          <td>
                            <Button variant="success" size="sm" onClick={() => handleConfirmAppointment(app._id)}>Confirmar</Button>{' '}
                            <Button variant="danger" size="sm" onClick={() => handleCancelAppointment(app._id)}>Cancelar</Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="confirmed" title={`Confirmados (${confirmedAppointments.length})`}>
              <Table striped bordered hover responsive>
                <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Obra Social</th></tr></thead>
                <tbody>
                  {confirmedAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">No hay turnos confirmados.</td>
                    </tr>
                  ) : (
                    confirmedAppointments.map(app => {
                      const nombre = [app.paciente?.nombre, app.paciente?.apellido]
                        .filter(Boolean)
                        .join(' ') || 'Sin datos';
                      const fecha = app.fechaHora ? dateFormatter.format(new Date(app.fechaHora)) : 'Sin fecha';
                      const hora = app.fechaHora ? timeFormatter.format(new Date(app.fechaHora)) : '--';
                      const obra = app.obraSocial?.nombre || 'Particular';

                      return (
                        <tr key={app._id}>
                          <td>{nombre}</td>
                          <td>{fecha}</td>
                          <td>{hora}</td>
                          <td>{obra}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="canceled" title={`Cancelados (${canceledAppointments.length})`}>
              <Table striped bordered hover responsive>
                <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Obra Social</th></tr></thead>
                <tbody>
                  {canceledAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">No hay turnos cancelados.</td>
                    </tr>
                  ) : (
                    canceledAppointments.map(app => {
                      const nombre = [app.paciente?.nombre, app.paciente?.apellido]
                        .filter(Boolean)
                        .join(' ') || 'Sin datos';
                      const fecha = app.fechaHora ? dateFormatter.format(new Date(app.fechaHora)) : 'Sin fecha';
                      const hora = app.fechaHora ? timeFormatter.format(new Date(app.fechaHora)) : '--';
                      const obra = app.obraSocial?.nombre || 'Particular';

                      return (
                        <tr key={app._id}>
                          <td>{nombre}</td>
                          <td>{fecha}</td>
                          <td>{hora}</td>
                          <td>{obra}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
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
          {insuranceError && <Alert variant="danger">{insuranceError}</Alert>}
          <Table striped bordered hover responsive>
            <thead><tr><th>Nombre</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {socialInsurances.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center">No hay obras sociales registradas.</td>
                </tr>
              ) : (
                socialInsurances.map(si => (
                  <tr key={si._id}>
                    <td>{si.nombre}</td>
                    <td className="text-end">
                      <Button variant="outline-primary" size="sm" onClick={() => handleShowModal('edit', si)}><PencilSquare /></Button>{' '}
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteInsurance(si._id)}><Trash /></Button>
                    </td>
                  </tr>
                ))
              )}
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
          {insuranceError && <Alert variant="danger">{insuranceError}</Alert>}
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
