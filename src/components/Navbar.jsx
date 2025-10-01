import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Navbar.css";
import logo from "../assets/logo-header.png";
import whatsapp from "../assets/whatsapp.png";
import instagram from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import { Justify } from 'react-bootstrap-icons';

function Header() {
  return (
    // 'expand="lg"' significa que el menú se colapsará en pantallas más pequeñas que 'large'
    // 'collapseOnSelect' hace que el menú se cierre al hacer clic en un enlace
    <Navbar collapseOnSelect expand="lg" className="navbar-custom shadow-sm" fixed="top">
      <Container fluid className="px-3">
        {/* Logo a la izquierda (ahora usando Navbar.Brand) */}
        <Navbar.Brand href="#inicio">
          <img src={logo} alt="Logo" className="logo-img" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav">
          {/* 2. USA EL ÍCONO AQUÍ DENTRO */}
          <Justify color="#333" size={30} />
        </Navbar.Toggle>

        {/* Contenido que se colapsará en el menú de hamburguesa */}
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* Links de navegación */}
          <Nav className="mx-auto nav-center fw-bold">
            <Nav.Link href="#inicio">INICIO</Nav.Link>
            <Nav.Link href="#formacion">FORMACIÓN</Nav.Link>
            <Nav.Link href="#consultorios">CONSULTORIOS</Nav.Link>
            <Nav.Link href="#turno">AGENDA TU TURNO</Nav.Link>
          </Nav>

          {/* Redes sociales (también dentro del menú colapsable) */}
          <Nav className="social-icons-nav">
            <Nav.Link href="https://www.instagram.com/belenmnutricion/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src={instagram} alt="instagram" className="social-icon" />
            </Nav.Link>
            <Nav.Link href="https://www.linkedin.com/in/mar%C3%ADa-bel%C3%A9n-marino-6a2560163/" target="_blank" rel="noreferrer" aria-label="Linkedin">
              <img src={linkedin} alt="linkedin" className="social-icon" />
            </Nav.Link>
            <Nav.Link href="https://wa.me/5491130392940" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <img src={whatsapp} alt="whatsApp" className="social-icon" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;