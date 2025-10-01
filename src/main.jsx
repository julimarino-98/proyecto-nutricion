// src/main.jsx - CORREGIDO

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* 1. BrowserRouter envuelve todo */}
      <AuthProvider> {/* 2. AuthProvider va por dentro */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);