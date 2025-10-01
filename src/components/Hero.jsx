import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Rulers, FileEarmarkText, Book } from 'react-bootstrap-icons';
import './Hero.css';
import profileImage from '../assets/presentacion.png';

function Hero() {
  return (
    <section id="inicio" className="hero-section">
      <Container>
        {/* --- Parte Superior (Presentación) --- */}
        <Row className="align-items-center">
          <Col md={7} lg={6} className="hero-text">
            <p className="hero-tagline">NUTRICIÓN CONSCIENTE Y PERSONALIZADA</p>
            <h1 className="fw-bold">Lic. Belén Marino</h1>
            <p className="lead my-4">
              Te acompaño a construir una relación saludable y sostenible con la comida, 
              mejorando tu bienestar físico y mental.
            </p>
            <Button href="#turno" variant="primary" size="lg" className="hero-cta-button">
              Agendá tu Turno
            </Button>
          </Col>
          <Col md={5} lg={6} className="text-center hero-image-col">
            <div className="hero-image-container">
              <img 
                src={profileImage} 
                alt="Licenciada Belén Marino" 
                className="hero-image" 
              />
            </div>
          </Col>
        </Row>

        {/* --- Parte Inferior (Barra de Servicios) --- */}
        <div className="hero-services-bar">
          <Row>
            <Col md={4} className="service-item">
              <Rulers className="service-item-icon" size={30} />
              <h4 className="fw-bold">Antropometría</h4>
              <p>Evaluación precisa de la composición corporal.</p>
            </Col>
            <Col md={4} className="service-item">
              <FileEarmarkText className="service-item-icon" size={30} />
              <h4 className="fw-bold">Planes Personalizados</h4>
              <p>Adaptados a tus objetivos y estilo de vida.</p>
            </Col>
            <Col md={4} className="service-item">
              <Book className="service-item-icon" size={30} />
              <h4 className="fw-bold">Educación Alimentaria</h4>
              <p>Construye una relación sana con la comida.</p>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default Hero;