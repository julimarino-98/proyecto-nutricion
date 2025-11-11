import React, { useState } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import "./LoginPage.css";
import logo from "../assets/logo-header.PNG";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado, intentando hacer login...");
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message || 'Correo electrónico o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <MDBCard>
        <MDBRow className='g-0'>
          <MDBCol md='6'>
            <MDBCardImage src={logo} alt="login form" className='rounded-start w-100'/>
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column justify-content-center'>

              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Acceso Administrativo</h5>

              {/* 1. Envolvemos los campos en una etiqueta <form> */}
              <form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Correo Electrónico' 
                  type='email' 
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Contraseña' 
                  type='password' 
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <MDBBtn className="mb-4 px-5 login-btn w-100" size='lg' type="submit">Ingresar</MDBBtn>
              </form>

            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </div>
  );
}

export default LoginPage;