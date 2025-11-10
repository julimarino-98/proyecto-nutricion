// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Función para simular el login
  const login = (email, password) => {
    // En un futuro, aquí harías una llamada a tu backend
    if (email === 'admin@mail.com' && password === 'admin') {
      const userData = { email: 'admin@mail.com', name: 'Admin' };
      setUser(userData); // Guarda los datos del usuario
      navigate('/admin'); // Redirige al panel de admin
      return true;
    } else {
      setUser(null);
      return false; // Devuelve falso si las credenciales son incorrectas
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Crear un hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}