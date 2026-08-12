import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CustomImageWithFallback: React.FC<CustomImageProps> = ({ src, alt, className }) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError || !src) {
    return (
      <div className={`fallback-img-container ${className || ''}`} style={{ background: '#e2e2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ color: '#717973', fontSize: '12px' }}>Image Unavailable</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Terbaru';
  try {
    const cleanStr = String(dateStr).replace(/-/g, '/');
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

interface ArticlesSectionProps {
  artikels: any[];
  formatImageUrl: (url?: string) => string;
  setSelectedArtikel?: (artikel: any) => void;
  artikelTrackRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  startX: number;
  setStartX: (val: number) => void;
  scrollLeftState: number;
  setScrollLeftState: (val: number) => void;
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  artikels,
  formatImageUrl,
  artikelTrackRef,
  isDragging,
  setIsDragging,
  startX,
  setStartX,
  scrollLeftState,
  setScrollLeftState
}) => {
  const navigate = useNavigate();

  const handleArticleClick = (artikel: any) => {
    if (!isDragging) {
      navigate('/artikel', { state: { selectedArtikel: artikel } });
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (artikelTrackRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      artikelTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    if (artikelTrackRef.current) {
      setStartX(pageX - artikelTrackRef.current.offsetLeft);
      setScrollLeftState(artikelTrackRef.current.scrollLeft);
    }
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !artikelTrackRef.current) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - artikelTrackRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    artikelTrackRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section id="artikel" className="section-artikel">
      <div className="landing-container">
        <div className="section-header-flex">
          <div>
            <h2 className="section-title-large" style={{ marginBottom: '8px' }}>Artikel & Berita</h2>
            <p className="section-desc" style={{ marginBottom: '0' }}>Insight dan informasi terbaru seputar UMKM</p>
          </div>
          <Link to="/artikel" className="btn-hero-secondary btn-outline">
            Lihat Semua <ArrowRight size={16} style={{ marginLeft: '6px' }} />
          </Link>
        </div>

        <div className="artikel-carousel-wrapper">
          <button className="artikel-nav-btn btn-prev" onClick={() => scrollCarousel('left')}>
            <ChevronLeft size={24} />
          </button>

          <div
            className={`artikel-carousel-track ${isDragging ? 'active' : ''}`}
            ref={artikelTrackRef}
            onMouseDown={onDragStart}
            onMouseLeave={onDragEnd}
            onMouseUp={onDragEnd}
            onMouseMove={onDragMove}
            onTouchStart={onDragStart}
            onTouchEnd={onDragEnd}
            onTouchMove={onDragMove}
          >
            {artikels.length > 0 ? (
              artikels.map((artikel) => (
                <div 
                  key={artikel.id_artikel || artikel.id} 
                  className="artikel-card-item"
                  onClick={() => handleArticleClick(artikel)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="artikel-card">
                    <div className="artikel-thumb-wrap">
                      <CustomImageWithFallback
                        src={formatImageUrl(artikel.thumbnail_url || artikel.gambar_thumbnail || artikel.gambar)}
                        alt={artikel.title || artikel.judul || 'Artikel'}
                        className="artikel-thumb-img"
                      />
                      <span className="artikel-tag-overlay">{artikel.kategori || 'Berita'}</span>
                    </div>
                    <div className="artikel-content">
                      <div className="artikel-meta">
                        <span className="artikel-date">
                          {formatDate(artikel.published_at || artikel.tanggal_publikasi || artikel.created_at)}
                        </span>
                      </div>
                      <h3 className="artikel-title">{artikel.title || artikel.judul}</h3>
                      <p className="artikel-excerpt">
                        {artikel.excerpt 
                          ? (artikel.excerpt.length > 85 ? artikel.excerpt.substring(0, 85) + '...' : artikel.excerpt)
                          : 'Baca selengkapnya mengenai informasi dan perkembangan UMKM terbaru.'}
                      </p>
                      <div className="link-read-more">
                        Baca Selengkapnya <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="artikel-card-item">
                  <div className="artikel-card placeholder-card">
                    <div className="artikel-thumb-wrap skeleton"></div>
                    <div className="artikel-content">
                      <div className="skeleton-text short"></div>
                      <div className="skeleton-text title"></div>
                      <div className="skeleton-text"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="artikel-nav-btn btn-next" onClick={() => scrollCarousel('right')}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
