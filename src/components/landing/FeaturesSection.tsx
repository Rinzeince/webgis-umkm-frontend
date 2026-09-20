import React from 'react';
import { Globe, Zap, ShieldCheck } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="layanan" className="section-features">
      <div className="landing-container">
        <div className="features-header">
          <span className="section-eyebrow">LAYANAN KAMI</span>
          <h2 className="section-title-large">
            Solusi pemetaan <span className="highlight-text">cerdas</span><br />
            untuk pertumbuhan ekonomi
          </h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Globe size={20} />
            </div>
            <h3 className="feature-title">Jangkauan Pasar Luas</h3>
            <p className="feature-desc">Identifikasi area potensial untuk ekspansi bisnis Anda melalui pemetaan digital yang presisi.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={20} />
            </div>
            <h3 className="feature-title">Aksesibilitas</h3>
            <p className="feature-desc">Dapat diakses melalui perangkat apa pun, kapan pun. Memudahkan konsumen menemukan produk lokal terdekat.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={20} />
            </div>
            <h3 className="feature-title">Analisis Terstruktur</h3>
            <p className="feature-desc">Pengelompokan karakteristik wilayah berbasis algoritma Machine Learning untuk mendukung pengambilan keputusan.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
