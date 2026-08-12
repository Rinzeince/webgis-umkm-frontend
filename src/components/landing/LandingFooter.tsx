import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const LandingFooter: React.FC = () => {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="navbar-logo" style={{ color: '#ffffff', marginBottom: '16px' }}>
              <div className="logo-badge-icon">
                <MapPin size={22} />
              </div>
              <span>SIGAP UMKM</span>
            </Link>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-heading">Tautan Cepat</h4>
            <ul>
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#layanan">Tentang Kami</a></li>
              <li><Link to="/peta">Peta UMKM</Link></li>
              <li><Link to="/artikel">Artikel</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Dukungan</h4>
            <ul>
              <li><a href="#">Kontak</a></li>
              <li><a href="#">Panduan Penggunaan</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Legal</h4>
            <ul>
              <li><a href="#">Kebijakan Privasi</a></li>
              <li><a href="#">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 SIGAP UMKM Kabupaten Bandung Barat. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
