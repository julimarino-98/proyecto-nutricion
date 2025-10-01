import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GeoAlt, CameraVideo } from 'react-bootstrap-icons';
import './Consultorios.css';

function Consultorios() {
  return (
    <section id="consultorios" className="consultorios-section">
      <Container>
        <Row>
          {/* Ubicación 1: Palermo */}
          <Col md={6} className="mb-4">
            <div className="location-card">
              <GeoAlt className="location-icon" size={40} />
              <h3 className="fw-bold">Caballito</h3>
              <p className="location-address">
                <a href="https://www.google.com/maps/place/Alimentaci%C3%B3n,+Nutrici%C3%B3n+y+Salud/@-34.6165451,-58.4653299,14z/data=!4m10!1m2!2m1!1snutricion!3m6!1s0x95bccb16ba5e7e57:0xcdf1357a900a6763!8m2!3d-34.6126651!4d-58.4375575!15sCgludXRyaWNpb25aCyIJbnV0cmljaW9ukgEMbnV0cml0aW9uaXN0mgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU5sY0RkbE1FbG5FQUWqAUAQASoNIgludXRyaWNpb24oDjIeEAEiGljZ8e7AAf3rRwH24788hRE8MV7wnyZPUMa1Mg0QAiIJbnV0cmljaW9u4AEA-gEECAAQPg!16s%2Fg%2F11s7bbc8r8?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                  Juan B. Ambrosetti 491, CABA
                </a>
              </p>
              <p className="location-schedule">
                <strong>Días:</strong> Lunes y Miércoles <br />
                <strong>Horario:</strong> 09:00 a 18:00 hs
              </p>
            </div>
          </Col>

          {/* Ubicación 2: Lomas de Zamora */}
          <Col md={6} className="mb-4">
            <div className="location-card">
              <GeoAlt className="location-icon" size={40} />
              <h3 className="fw-bold">Lomas de Zamora</h3>
              <p className="location-address">
                <a href="https://www.google.com/maps/place/Consultorio+M%C3%A9dico+Laprida/@-34.7600077,-58.423109,15z/data=!4m10!1m2!2m1!1sconsultorios!3m6!1s0x95bcd28dee667a73:0xc7c48c27865b0269!8m2!3d-34.7599778!4d-58.4066803!15sCgxjb25zdWx0b3Jpb3OSAQ5tZWRpY2FsX2NsaW5pY6oBRhABKhAiDGNvbnN1bHRvcmlvcygOMh4QASIa7g4IPChHuWN7q_fJeghrvh-pjOLcNBOAlusyEBACIgxjb25zdWx0b3Jpb3PgAQA!16s%2Fg%2F11hyl5n_82?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                  Laprida 686, GBA Sur
                </a>
              </p>
              <p className="location-schedule">
                <strong>Días:</strong> Martes <br />
                <strong>Horario:</strong> 10:00 a 19:00 hs
              </p>
            </div>
          </Col>

          {/* Ubicación 3: Martinez */}
          <Col md={6} className="mb-4">
            <div className="location-card">
              <GeoAlt className="location-icon" size={40} />
              <h3 className="fw-bold">Martinez</h3>
              <p className="location-address">
                <a href="https://www.google.com/maps/place/R%C3%ADo+de+Janeiro+2293,+B1640DQC+Mart%C3%ADnez,+Provincia+de+Buenos+Aires/@-34.5052215,-58.5327211,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb0f385a4b967:0x5636a582d7ac80c5!8m2!3d-34.505226!4d-58.5281077!16s%2Fg%2F11jdcyzbwg?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                  Río de Janeiro 2293
                </a>
              </p>
              <p className="location-schedule">
                <strong>Días:</strong> Jueves <br />
                <strong>Horario:</strong> 08:00 a 17:00 hs
              </p>
            </div>
          </Col>

          {/* Ubicación 4: Virtual */}
          <Col md={6} className="mb-4">
            <div className="location-card">
              <CameraVideo className="location-icon" size={40} />
              <h3 className="fw-bold">Modalidad Virtual</h3>
              <p className="location-address">
                Consultas online desde la comodidad de tu casa, estés donde estés.
              </p>
              <p className="location-schedule">
                <strong>Días:</strong> Viernes <br />
                <strong>Horario:</strong> Amplia disponibilidad
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Consultorios;