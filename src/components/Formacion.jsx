import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import './Formacion.css'; 
import professionalPhoto from '../assets/favaloro.jpg';

function Formacion() {
  return (
    <section id="formacion" className="formation-section">
      <Container>
        <Row className="align-items-center">
          {/* Columna Izquierda: Acordeón de Formación */}
          <Col md={7}>
            <h2 className="fw-bold mb-4">Mi Formación Profesional</h2>
            <p className="lead mb-4">
              Mi compromiso es mantenerme siempre actualizada para ofrecerte la
              mejor atención, basada en evidencia científica y un enfoque integral.
            </p>
            
            {/* 3. Usamos el componente Accordion */}
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Licenciatura en Nutrición</Accordion.Header>
                <Accordion.Body>
                  <strong>Universidad Favaloro, 2017.</strong> Egresada con honores, enfocada en nutrición clínica y prevención de enfermedades crónicas.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Cursos y Capacitaciones</Accordion.Header>
                <Accordion.Body>
                  <ul className="course-list-accordion">
                    <li>Alimentación vegetariana y vegana</li>
                    <li>Alimentos funcionales y suplementos dietarios</li>
                    <li>Alimentación durante el embarazo</li>
                    <li>Nutrición funcional integrativa</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Antropometría ISAK Nivel 1</Accordion.Header>
                <Accordion.Body>
                  Certificación internacional para la medición precisa de la composición corporal, esencial para el seguimiento deportivo y clínico.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>

          {/* Columna Derecha: Imagen */}
          <Col md={5} className="text-center d-none d-md-block">
            <img 
              src={professionalPhoto}
              alt="Nutricionista Belén Marino" 
              className="formation-image"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Formacion;