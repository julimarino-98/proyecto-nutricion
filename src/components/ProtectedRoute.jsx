import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, token } = useAuth();

  if (!user || !token) {
    // Si no hay usuario logueado, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si hay un usuario, muestra el contenido de la página protegida
  return children;
}

export default ProtectedRoute;
