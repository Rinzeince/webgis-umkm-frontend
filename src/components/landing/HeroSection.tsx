import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  statistik?: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ statistik }) => {
  const totalUmkm = statistik?.total_umkm_aktif !== undefined && statistik?.total_umkm_aktif !== null
    ? `${statistik.total_umkm_aktif.toLocaleString('id-ID')}+`
    : '124+';
  const totalKecamatan = statistik?.total_kecamatan ?? 16;
  const kOptimal = statistik?.analisis_terakhir?.k_optimal ?? 5;

  return (
    <section id="beranda" className="hero-section">
      <div className="landing-container">
        <div className="hero-card">
          <div className="hero-bg-overlay"></div>
          
          <div className="hero-content">
            <h1 className="hero-title">
              Visualisasi<br/>
              <span className="text-highlight-lime">Potensi UMKM Lokal</span><br/>
              dengan GIS
            </h1>
            <p className="hero-subtitle">
              Platform pemetaan digital cerdas untuk menemukan, menganalisis, dan mengembangkan ekosistem Usaha Mikro Kecil dan Menengah di wilayah Kabupaten Bandung Barat secara presisi.
            </p>
            
            <div className="hero-btn-group">
              <Link to="/peta" className="btn-hero-lime">
                Mulai Sekarang <ArrowRight size={18} />
              </Link>
              <a href="#layanan" className="btn-hero-secondary">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{totalUmkm}</span>
              <span className="stat-label">UMKM Aktif</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{totalKecamatan}</span>
              <span className="stat-label">Kecamatan</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{kOptimal}</span>
              <span className="stat-label">Klaster Potensi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
