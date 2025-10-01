import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Services.css';

function Services() {
  return (
    <section id="servicios" className="services-section-sobrio">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold">Servicios</h2>
          <p className="lead text-muted">Un enfoque integral para tu bienestar.</p>
        </div>

        <Row>
          {/* Tarjeta 1: Antropometría */}
          <Col md={4} className="mb-4">
            <div className="service-card-sobrio">
              <div className="card-content">
                <h3>Antropometría</h3>
                <p>Evaluación precisa de la composición corporal para un seguimiento detallado de tu progreso. Certificación ISAK Nivel 1.</p>
              </div>
              <Button className="card-button">Conocer más</Button>
            </div>
          </Col>

          {/* Tarjeta 2: Planes Personalizados */}
          <Col md={4} className="mb-4">
            <div className="service-card-sobrio">
              <div className="card-content">
                <h3>Planes Personalizados</h3>
                <p>Creación de planes de alimentación adaptados a tus objetivos, estilo de vida y preferencias personales.</p>
              </div>
              <Button className="card-button">Conocer más</Button>
            </div>
          </Col>

          {/* Tarjeta 3: Educación Alimentaria */}
          <Col md={4} className="mb-4">
            <div className="service-card-sobrio">
              <div className="card-content">
                <h3>Educación Alimentaria</h3>
                <p>Aprende a leer etiquetas, a elegir alimentos y a construir una relación sana y consciente con la comida.</p>
              </div>
              <Button className="card-button">Conocer más</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Services;