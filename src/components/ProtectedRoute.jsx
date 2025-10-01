import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Si no hay usuario logueado, redirige a la página de login
    return <Navigate to="/login" />;
  }

  // Si hay un usuario, muestra el contenido de la página protegida
  return children;
}

export default ProtectedRoute