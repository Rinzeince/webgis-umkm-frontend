import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Navigation,
  Share2,
  ArrowLeft,
  Info,
  Image as ImageIcon,
  CheckCircle2,
  Store,
  Target,
  Utensils,
  Palette,
  Shirt,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../utils/leafletIconFix';
import { getUmkmDetail, getUmkmList } from '../api/webgisApi';
import { Umkm } from '../types/webgis';
import { getKategoriColor, createCustomUmkmIcon } from '../utils/clusterColors';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import { formatImageUrl } from '../utils/imageUrl';
import '../styles/landing.css';
import '../styles/detailUmkm.css';

const getCategoryIconDetails = (catName: string) => {
  const name = catName.toLowerCase();
  if (name.includes('kuliner') || name.includes('makanan') || name.includes('pangan')) {
    return {
      bg: '#fde68a',
      color: '#7c2d12',
      icon: <Utensils size={18} />
    };
  }
  if (name.includes('kriya') || name.includes('kerajinan') || name.includes('craft')) {
    return {
      bg: '#bbf7d0',
      color: '#14532d',
      icon: <Palette size={18} />
    };
  }
  if (name.includes('pakaian') || name.includes('fashion') || name.includes('tekstil')) {
    return {
      bg: '#fecdd3',
      color: '#9f1239',
      icon: <Shirt size={18} />
    };
  }
  return {
    bg: '#d8f8e1',
    color: '#0e382b',
    icon: <Store size={18} />
  };
};

const DetailUmkmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [umkm, setUmkm] = useState<Umkm | null>(null);
  const [otherUmkmList, setOtherUmkmList] = useState<Umkm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    getUmkmDetail(id)
      .then((data) => {
        setUmkm(data);
        if (data.kecamatan?.id_kecamatan) {
          getUmkmList({ kecamatan: data.kecamatan.id_kecamatan })
            .then((list) => {
              setOtherUmkmList(list.filter((u) => u.id_umkm !== data.id_umkm).slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Error fetching UMKM detail:', err);
        setError('Data UMKM tidak ditemukan atau sedang tidak aktif.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSmoothScroll = (e: React.MouseEvent, _idStr?: string) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="landing-body">
        <LandingNavbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          handleSmoothScroll={handleSmoothScroll}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 16px auto' }} />
            <p style={{ color: '#717973', fontSize: '15px' }}>Memuat detail informasi UMKM...</p>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  if (error || !umkm) {
    return (
      <div className="landing-body">
        <LandingNavbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          handleSmoothScroll={handleSmoothScroll}
        />
        <div className="landing-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="detail-card-white" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
            <Store size={48} style={{ color: '#0e382b', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, color: '#0e382b', marginBottom: '8px' }}>
              UMKM Tidak Ditemukan
            </h2>
            <p style={{ fontSize: '14px', color: '#717973', marginBottom: '24px' }}>
              {error || 'Data UMKM yang Anda cari tidak tersedia.'}
            </p>
            <Link to="/peta" className="btn-hero-lime" style={{ display: 'inline-flex' }}>
              ← Kembali ke Peta WebGIS
            </Link>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  const katName = umkm.kategori?.nama_kategori || 'Lainnya';
  const color = umkm.kategori?.warna_marker || getKategoriColor(katName);
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${umkm.latitude},${umkm.longitude}`;
  const kecName = umkm.kecamatan?.nama_kecamatan || 'Lembang';

  return (
    <div className="landing-body">
      {/* ===== NAVBAR ===== */}
      <LandingNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleSmoothScroll={handleSmoothScroll}
      />

      <div className="landing-container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* ===== TOP TITLE HEADER CARD ===== */}
        <div className="detail-header-card">
          <div className="header-card-left">
            <div className="store-badge-icon" style={{ backgroundColor: color || '#0e382b' }}>
              <Store size={26} color="#ffffff" />
            </div>

            <div>
              <div className="badges-flex">
                <span className="pill-category-badge">{katName.toUpperCase()}</span>
                <span className="pill-verified-badge">
                  <CheckCircle2 size={13} style={{ marginRight: '4px' }} /> UMKM Terverifikasi
                </span>
              </div>
              <h1 className="detail-store-title">{umkm.nama_umkm}</h1>
              <p className="detail-store-location">{kecName}, Kabupaten Bandung Barat</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/peta')}
            className="btn-back-peta-pill"
          >
            <ArrowLeft size={16} /> Kembali ke Peta
          </button>
        </div>

        {/* ===== TWO COLUMN CONTENT GRID ===== */}
        <div className="detail-main-layout">
          {/* LEFT COLUMN */}
          <div className="detail-col-left">
            {/* INFORMASI UMKM CARD */}
            <div className="detail-card-white card-info-umkm">
              <div className="card-section-heading">
                <Info size={20} className="section-heading-icon" />
                <h2>Informasi UMKM</h2>
              </div>
              <hr className="card-divider" />

              <div className="info-two-cols">
                <div className="info-sub-item">
                  <div className="info-icon-circle">
                    <MapPin size={18} color="#0e382b" />
                  </div>
                  <div>
                    <span className="info-label-mini">ALAMAT LENGKAP</span>
                    <p className="info-value-text">
                      {umkm.alamat_lengkap ? umkm.alamat_lengkap : `Kecamatan ${kecName}`}
                      {kecName && !umkm.alamat_lengkap?.includes(kecName) && `, Kec. ${kecName}`}
                      , Kabupaten Bandung Barat, Jawa Barat 40391
                    </p>
                  </div>
                </div>

                <div className="info-sub-item">
                  <div className="info-icon-circle">
                    <Clock size={18} color="#0e382b" />
                  </div>
                  <div>
                    <span className="info-label-mini">JAM OPERASIONAL</span>
                    <p className="info-value-text font-bold">Buka Setiap Hari</p>
                    <p className="info-value-sub">
                      {umkm.jam_buka && umkm.jam_tutup
                        ? `${umkm.jam_buka.substring(0, 5)} - ${umkm.jam_tutup.substring(0, 5)} WIB`
                        : (umkm.jam_operasional || '08.00 - 17.00 WIB')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GAMBAR / GALERI USAHA CARD */}
            <div className="detail-card-white card-galeri-usaha">
              <div className="card-section-heading">
                <ImageIcon size={20} className="section-heading-icon" />
                <h2>Gambar / Galeri Usaha</h2>
              </div>

              <div className="galeri-box-wrap">
                {umkm.foto_url ? (
                  <img
                    src={formatImageUrl(umkm.foto_url)}
                    alt={umkm.nama_umkm}
                    className="galeri-display-img"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'galeri-empty-placeholder';
                        placeholder.innerHTML = `<div class="empty-icon-wrap"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div><p>Tidak ada foto tersedia untuk UMKM ini.</p>`;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div className="galeri-empty-placeholder">
                    <div className="empty-icon-wrap">
                      <ImageIcon size={40} color="#a3a3a3" />
                    </div>
                    <p>Tidak ada foto tersedia untuk UMKM ini.</p>
                  </div>
                )}
              </div>
            </div>

            {/* UMKM SEKITAR CARD */}
            {otherUmkmList.length > 0 && (
              <div className="detail-card-white card-umkm-sekitar">
                <div className="card-section-heading flex-between">
                  <div className="heading-left-flex">
                    <Target size={20} className="section-heading-icon" />
                    <h2>UMKM Sekitar {kecName}</h2>
                  </div>
                  <Link to={`/peta?kecamatan=${umkm.kecamatan?.id_kecamatan || ''}`} className="link-see-all">
                    Lihat Semua
                  </Link>
                </div>

                <div className="around-umkm-grid">
                  {otherUmkmList.map((item) => {
                    const itemKat = item.kategori?.nama_kategori || 'Lainnya';
                    const iconDetails = getCategoryIconDetails(itemKat);

                    return (
                      <Link
                        key={item.id_umkm}
                        to={`/umkm/${item.id_umkm}`}
                        className="around-card-item"
                      >
                        <div
                          className="around-icon-wrap"
                          style={{ backgroundColor: iconDetails.bg, color: iconDetails.color }}
                        >
                          {iconDetails.icon}
                        </div>
                        <div className="around-text-wrap">
                          <span className="around-title">{item.nama_umkm}</span>
                          <span className="around-category">{itemKat}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <aside className="detail-col-right">
            <div className="lokasi-navigasi-card card-lokasi-navigasi">
              <div className="card-section-heading white">
                <Navigation size={22} color="#80f29d" />
                <h2>Lokasi & Navigasi</h2>
              </div>

              {/* Minimap Leaflet */}
              {umkm.latitude && umkm.longitude && (
                <div className="minimap-container-wrap">
                  <MapContainer
                    center={[umkm.latitude, umkm.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    className="minimap-leaflet"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[umkm.latitude, umkm.longitude]}
                      icon={createCustomUmkmIcon(katName, color)}
                    />
                  </MapContainer>
                </div>
              )}

              <div className="sidebar-btn-group">
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gmaps-lime"
                >
                  <Navigation size={18} /> Buka di Google Maps
                </a>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="btn-share-outline"
                >
                  <Share2 size={18} /> Bagikan Halaman Ini
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* TOAST COPIED NOTIFICATION */}
      {showToast && (
        <div className="toast-copied-pill">
          <span>✅ Link detail UMKM telah disalin ke clipboard!</span>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <LandingFooter />
    </div>
  );
};

export default DetailUmkmPage;
