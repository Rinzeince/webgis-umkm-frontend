import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PetaPage from './pages/PetaPage';

// These pages are rarely the entry point, lazy-load them
const ArtikelPage = lazy(() => import('./pages/ArtikelPage'));
const DetailUmkmPage = lazy(() => import('./pages/DetailUmkmPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
    <div className="spinner"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/peta" element={<PetaPage />} />
        <Route path="/umkm/:id" element={<DetailUmkmPage />} />
        <Route path="/artikel" element={<ArtikelPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
