import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getArtikelList } from '../api/webgisApi';
import '../styles/landing.css';

import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import { formatImageUrl } from '../utils/imageUrl';

interface ArtikelItem {
  id_artikel: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  thumbnail_url?: string;
  penulis?: string;
  author?: string;
  published_at?: string;
  kategori?: string;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '12 Okt 2024';
  try {
    const cleanStr = String(dateStr).replace(/-/g, '/');
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const ArtikelPage: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artikels, setArtikels] = useState<ArtikelItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Terbaru');
  const [loading, setLoading] = useState(true);
  const [selectedArtikel, setSelectedArtikel] = useState<ArtikelItem | null>(null);

  useEffect(() => {
    if (location.state?.selectedArtikel) {
      setSelectedArtikel(location.state.selectedArtikel);
    }
  }, [location.state]);

  const fetchArtikels = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const data = await getArtikelList(query ? { q: query } : {});
      setArtikels(data || []);
    } catch (err) {
      console.error('Failed to fetch artikels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtikels();
  }, [fetchArtikels]);

  // Handle live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArtikels(searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchArtikels]);

  const handleSmoothScroll = (e: React.MouseEvent, _id?: string) => {
    e.preventDefault();
  };

  const categories = ['Terbaru', 'Populer', 'Kuliner', 'Kerajinan'];

  return (
    <div className="landing-body">
      {/* ===== NAVBAR ===== */}
      <LandingNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleSmoothScroll={handleSmoothScroll}
      />

      {/* ===== HERO ARTIKEL SECTION ===== */}
      <section className="hero-section artikel-hero-section">
        <div className="landing-container">
          <div className="hero-card artikel-hero-card">
            <div className="hero-bg-overlay"></div>

            <div className="hero-content artikel-hero-content">
              <h1 className="hero-title artikel-hero-title">
                Artikel & Berita<br />
                <span className="text-highlight-lime">UMKM Bandung Barat</span>
              </h1>
              <p className="hero-subtitle artikel-hero-subtitle">
                Temukan inspirasi, tips bisnis, dan kabar terbaru seputar perkembangan Usaha Mikro, Kecil, dan Menengah di wilayah Kabupaten Bandung Barat.
              </p>

              {/* Combined Search & Filter Bar */}
              <div className="artikel-search-filter-wrap">
                <div className="search-input-inner">
                  <Search size={18} className="search-icon-svg" />
                  <input
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="hero-search-input"
                  />
                  {searchQuery && (
                    <button className="btn-clear-input" onClick={() => setSearchQuery('')}>
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="category-select-wrap">
                  <select
                    className="hero-category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Kuliner">Kuliner</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Inovasi">Inovasi</option>
                    <option value="Digitalisasi">Digitalisasi</option>
                  </select>
                </div>

                <button className="btn-search-hero-submit">Cari</button>
              </div>

              {/* Category Filter Chips */}
              <div className="category-chips-row">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATALOG ARTIKEL GRID ===== */}
      <section className="section-artikel" style={{ padding: '0 0 90px', backgroundColor: '#f9f9f9' }}>
        <div className="landing-container">
          {loading ? (
            <div className="map-loading" style={{ minHeight: '260px', textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#717973' }}>Mencari artikel...</p>
            </div>
          ) : artikels.length === 0 ? (
            <div className="empty-artikel-state" style={{ textAlign: 'center', padding: '60px 0' }}>
              <BookOpen size={48} style={{ color: '#0e382b', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-montserrat)', color: '#0e382b', marginBottom: '8px' }}>
                Artikel Tidak Ditemukan
              </h3>
              <p style={{ color: '#717973', marginBottom: '20px' }}>
                Tidak ada artikel yang cocok dengan kata kunci "{searchQuery}". Coba gunakan kata kunci lain.
              </p>
              <button className="btn-hero-lime" onClick={() => { setSearchQuery(''); setSelectedCategory('Terbaru'); }}>
                Tampilkan Semua Artikel
              </button>
            </div>
          ) : (
            <>
              <div className="artikel-grid-catalog">
                {artikels.map((item) => {
                  const thumbUrl = formatImageUrl(item.thumbnail_url);

                  return (
                    <div
                      key={item.id_artikel}
                      className="artikel-card catalog-card"
                      onClick={() => setSelectedArtikel(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="artikel-thumb-wrap">
                        <img
                          src={thumbUrl || '/images/landing_map_preview.png'}
                          alt={item.title}
                          className="artikel-thumb-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/landing_map_preview.png';
                          }}
                        />
                        <span className="artikel-tag-overlay">{item.kategori || 'Berita'}</span>
                      </div>

                      <div className="artikel-content">
                        <div className="artikel-meta">
                          <span className="artikel-date">
                            <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            {formatDate(item.published_at)}
                          </span>
                          <span className="artikel-author" style={{ marginLeft: '12px' }}>
                            <User size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            {item.penulis || item.author || 'Tim Redaksi'}
                          </span>
                        </div>

                        <h3 className="artikel-title">{item.title}</h3>
                        <p className="artikel-excerpt">
                          {item.excerpt || (item.content ? item.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : 'Baca selengkapnya mengenai informasi dan perkembangan UMKM terbaru.')}
                        </p>

                        <div className="link-read-more">
                          <span>Baca Selengkapnya</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="pagination-row">
                <button className="page-nav-btn" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="page-num-btn active">1</button>
                <button className="page-num-btn">2</button>
                <button className="page-num-btn">3</button>
                <span className="page-dots">...</span>
                <button className="page-nav-btn">
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== DETAIL MODAL READER ===== */}
      {selectedArtikel && (
        <div className="artikel-modal-overlay" onClick={() => setSelectedArtikel(null)}>
          <div className="artikel-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedArtikel(null)}>
              <X size={22} />
            </button>

            {selectedArtikel.thumbnail_url && (
              <div className="modal-thumb-wrap">
                <img
                  src={formatImageUrl(selectedArtikel.thumbnail_url)}
                  alt={selectedArtikel.title}
                  className="modal-thumb-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/landing_map_preview.png';
                  }}
                />
              </div>
            )}

            <div className="modal-body-content">
              <div className="artikel-meta" style={{ marginBottom: '14px' }}>
                <span className="artikel-tag-overlay" style={{ position: 'relative', top: 'auto', left: 'auto', display: 'inline-block', marginBottom: '8px' }}>
                  {selectedArtikel.kategori || 'EDUKASI UMKM'}
                </span>
                <div style={{ display: 'flex', gap: '16px', color: '#717973', fontSize: '13px' }}>
                  <span className="artikel-date">
                    <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    {formatDate(selectedArtikel.published_at)}
                  </span>
                  <span className="artikel-author">
                    <User size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    {selectedArtikel.penulis || selectedArtikel.author || 'Tim Redaksi'}
                  </span>
                </div>
              </div>

              <h2 className="modal-title">{selectedArtikel.title}</h2>

              {selectedArtikel.excerpt && (
                <p className="modal-excerpt">{selectedArtikel.excerpt}</p>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid #e2e2e2', margin: '24px 0' }} />

              <div
                className="modal-html-content"
                dangerouslySetInnerHTML={{ __html: selectedArtikel.content || selectedArtikel.excerpt || '' }}
              />

              <div className="modal-bottom-actions" style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #e2e2e2', textAlign: 'center' }}>
                <button
                  className="btn-hero-lime"
                  onClick={() => setSelectedArtikel(null)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontSize: '14px' }}
                >
                  <X size={18} /> Tutup Artikel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER (USES LANDING FOOTER) ===== */}
      <LandingFooter />
    </div>
  );
};

export default ArtikelPage;
