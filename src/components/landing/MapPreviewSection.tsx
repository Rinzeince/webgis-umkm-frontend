import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CustomImageWithFallback: React.FC<CustomImageProps> = ({ src, alt, className }) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError || !src) {
    return (
      <div className={`fallback-img-container ${className || ''}`}>
        <MapPin size={48} className="text-emerald-400" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
};

interface MapPreviewSectionProps {
  statistik?: any;
}

const MapPreviewSection: React.FC<MapPreviewSectionProps> = ({ statistik }) => {
  const totalUmkm = statistik?.total_umkm_aktif !== undefined && statistik?.total_umkm_aktif !== null
    ? `${statistik.total_umkm_aktif.toLocaleString('id-ID')}+`
    : '124+';

  return (
    <section id="peta" className="section-map-preview">
      <div className="landing-container map-preview-grid">
        <div className="map-preview-content">
          <span className="section-eyebrow">PETA DIGITAL & INOVASI</span>
          <h2 className="section-title-large">Eksplorasi UMKM.<br/>Lebih Terarah.</h2>
          <p className="section-desc">
            Visualisasikan persebaran UMKM dan kebutuhan jasa kreatif di berbagai wilayah untuk pengambilan keputusan bisnis yang lebih akurat. Platform kami mengintegrasikan data spasial dan demografi untuk memberikan wawasan mendalam.
          </p>
          <Link to="/peta" className="btn-hero-lime map-preview-cta-btn" style={{ marginTop: '12px' }}>
            Buka Peta GIS ↗
          </Link>
        </div>

        <div className="map-preview-visual">
          <Link to="/peta" style={{ textDecoration: 'none', display: 'block' }}>
            <div className="map-preview-card" style={{ cursor: 'pointer' }}>
              <CustomImageWithFallback 
                src="/images/landing_map_preview.png" 
                alt="WebGIS UMKM Kabupaten Bandung Barat" 
                className="map-preview-img"
              />
              <div className="map-preview-badge">
                <div className="badge-icon">
                  <MapPin size={24} color="#001d0f" />
                </div>
                <div className="badge-label-wrap">
                  <span className="badge-label-value">{totalUmkm}</span>
                  <span className="badge-label-title">UMKM Terdaftar</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MapPreviewSection;
