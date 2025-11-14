import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Envelope, Telephone, Whatsapp, Instagram, Linkedin } from 'react-bootstrap-icons';
import logo from '../assets/logo-header.PNG';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <Row>
          {/* Columna 1: Logo y descripción */}
          <Col md={4} className="footer-col">
            <img src={logo} alt="Logo" className="footer-logo mb-3" />
            <p>
              Acompañamiento profesional para construir una relación saludable y sostenible con la comida.
            </p>
          </Col>

          {/* Columna 2: Mapa del Sitio */}
          <Col md={4} className="footer-col">
            <h5>Mapa del Sitio</h5>
            <Nav className="flex-column footer-links">
              <Nav.Link href="#inicio">Inicio</Nav.Link>
              <Nav.Link href="#formacion">Formación</Nav.Link>
              <Nav.Link href="#consultorios">Consultorios</Nav.Link>
              <Nav.Link href="#turno">Agenda tu Turno</Nav.Link>
            </Nav>
          </Col>

          {/* Columna 3: Contacto */}
          <Col md={4} className="footer-col">
            <h5>Contacto</h5>
            <ul className="footer-contact">
              <li>
                <Envelope className="footer-icon" /> 
                <a href="mailto:belenmarino.nutricion@gmail.com">belenmarino.nutricion@gmail.com</a>
              </li>
              <li>
                <Whatsapp className="footer-icon" /> 
                <a href="https://wa.me/5491130392940" target="_blank" rel="noopener noreferrer">+54 9 11 3039-2940</a>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; {currentYear} Lic. Belén Marino. Todos los derechos reservados.
          </p>
          <div className="social-icons-footer">
            <a href="https://www.instagram.com/belenmnutricion/" target="_blank" rel="noopener noreferrer"><Instagram /></a>
            <a href="https://www.linkedin.com/in/mar%C3%ADa-bel%C3%A9n-marino-6a2560163/" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;