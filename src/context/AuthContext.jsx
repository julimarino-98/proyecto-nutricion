// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// 1. Crear el Contexto
const AuthContext = createContext();

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { storedToken: null, storedUser: null };
  }

  try {
    const storedToken = window.localStorage.getItem('authToken');
    const storedUserRaw = window.localStorage.getItem('authUser');
    const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
    return { storedToken, storedUser };
  } catch (error) {
    console.error('Error al leer las credenciales almacenadas', error);
    return { storedToken: null, storedUser: null };
  }
};

// 2. Crear el Proveedor del Contexto
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { storedToken, storedUser } = getStoredAuth();
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser);

  const persistAuth = useCallback((nextToken, nextUser) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (nextToken && nextUser) {
      window.localStorage.setItem('authToken', nextToken);
      window.localStorage.setItem('authUser', JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('authUser');
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const message = errData.message || 'No se pudo iniciar sesión';
          throw new Error(message);
        }

        const data = await response.json();
        const { token: receivedToken, usuario } = data;

        if (!receivedToken || !usuario) {
          throw new Error('Respuesta de autenticación inválida');
        }

        setToken(receivedToken);
        setUser(usuario);
        persistAuth(receivedToken, usuario);
        navigate('/admin');

        return { success: true };
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setToken(null);
        setUser(null);
        persistAuth(null, null);
        return { success: false, message: error.message };
      }
    },
    [navigate, persistAuth]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    persistAuth(null, null);
    navigate('/login');
  }, [navigate, persistAuth]);

  const value = {
    user,
    token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Crear un hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}