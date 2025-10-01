import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import MainLayout from './components/MainLayout.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />

      {/* 3. RUTA DE ADMIN PROTEGIDA */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;