import React from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LandingNavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleSmoothScroll: (e: React.MouseEvent, id: string) => void;
}

const LandingNavbar: React.FC<LandingNavbarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  handleSmoothScroll,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="landing-navbar">
      <div className="landing-container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-badge-icon">
            <MapPin size={20} />
          </div>
          SIGAP UMKM
        </Link>

        <ul className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            {currentPath === '/' ? (
              <a href="#beranda" className={currentPath === '/' ? 'active' : ''} onClick={(e) => handleSmoothScroll(e, 'beranda')}>
                Beranda
              </a>
            ) : (
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Beranda
              </Link>
            )}
          </li>
          <li>
            {currentPath === '/' ? (
              <a href="#layanan" onClick={(e) => handleSmoothScroll(e, 'layanan')}>
                Tentang Kami
              </a>
            ) : (
              <Link to="/" state={{ scrollTo: 'layanan' }} onClick={() => setMobileMenuOpen(false)}>
                Tentang Kami
              </Link>
            )}
          </li>
          <li>
            <Link to="/peta" className={currentPath === '/peta' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
              Peta UMKM
            </Link>
          </li>
          <li>
            <Link to="/artikel" className={currentPath === '/artikel' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
              Artikel
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <button className="btn-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
