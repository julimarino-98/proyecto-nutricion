import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Navbar.jsx';
import Footer from './Footer.jsx';

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Aquí se renderizará HomePage, etc. */}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;