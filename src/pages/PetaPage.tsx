import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Layers, Sun, PanelLeftClose, PanelLeftOpen, X, Utensils, Palette, Shirt, Wrench, Store } from 'lucide-react';
import WebGisMap from '../components/map/WebGisMap';
import MapFilter from '../components/map/MapFilter';
import MapSearchBar from '../components/map/MapSearchBar';
import MapLegend from '../components/map/MapLegend';
import {
  getClusterData,
  getUmkmList,
  getKategoriUmkm,
  getKecamatanList,
} from '../api/webgisApi';
import { KATEGORI_COLORS } from '../utils/clusterColors';
import {
  HasilCluster,
  Umkm,
  KategoriUmkm,
  Kecamatan,
  ActiveKategoriState,
  FlyToCoords,
  MergedKecamatanProperties,
} from '../types/webgis';

/**
 * PetaPage — Full-screen WebGIS map page with collapsible & responsive sidebar.
 */
const PetaPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Sidebar state: default open on desktop (>=768px), closed on mobile (<768px)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // API Data
  const [clusterData, setClusterData] = useState<HasilCluster[]>([]);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kategoriList, setKategoriList] = useState<KategoriUmkm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter state
  const [activeKategori, setActiveKategori] = useState<ActiveKategoriState>({});
  const [activeKecamatan, setActiveKecamatan] = useState<number | null>(null);
  const [flyToCoords, setFlyToCoords] = useState<FlyToCoords | null>(null);
  const [selectedUmkmId, setSelectedUmkmId] = useState<number | null>(null);

  // Selected polygon info
  const [selectedKecamatan, setSelectedKecamatan] = useState<MergedKecamatanProperties | null>(null);

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [clusters, umkms, kategoris, kecamatans] = await Promise.all([
          getClusterData(),
          getUmkmList(),
          getKategoriUmkm(),
          getKecamatanList(),
        ]);

        setClusterData(clusters || []);
        setUmkmList(umkms || []);
        setKategoriList(kategoris || []);
        setKecamatanList(kecamatans || []);

        // Initialize all kategori toggles as active
        const initialToggles: ActiveKategoriState = {};
        (kategoris || []).forEach((k) => {
          initialToggles[k.nama_kategori] = true;
        });
        setActiveKategori(initialToggles);
      } catch (err) {
        console.error('Failed to load WebGIS data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Toggle kategori filter
  const handleKategoriToggle = useCallback((namaKategori: string) => {
    setActiveKategori((prev) => ({
      ...prev,
      [namaKategori]: !prev[namaKategori],
    }));
  }, []);

  // Handle kecamatan filter change
  const handleKecamatanChange = useCallback((idKec: number | null) => {
    setActiveKecamatan(idKec);
    if (!idKec) {
      setSelectedKecamatan(null);
    } else {
      const cluster = clusterData.find((c) => c.id_kecamatan === idKec);
      const kec = kecamatanList.find((k) => k.id_kecamatan === idKec);
      if (kec) {
        setSelectedKecamatan({
          id_kecamatan: idKec,
          nama_kecamatan: kec.nama_kecamatan,
          ...(cluster || {}),
        });
      }
    }
  }, [clusterData, kecamatanList]);

  // Auto-activate kecamatan filter if passed via URL parameter (e.g. from Detail UMKM "Lihat Semua")
  useEffect(() => {
    const kecParam = searchParams.get('kecamatan');
    if (kecParam && kecamatanList.length > 0) {
      const kecId = parseInt(kecParam, 10);
      const foundKec = !isNaN(kecId)
        ? kecamatanList.find((k) => k.id_kecamatan === kecId)
        : kecamatanList.find((k) => k.nama_kecamatan.toLowerCase() === kecParam.toLowerCase());

      if (foundKec) {
        handleKecamatanChange(foundKec.id_kecamatan);
      }
    }
  }, [searchParams, kecamatanList, handleKecamatanChange]);

  // Handle polygon click
  const handleKecamatanSelect = useCallback((properties: MergedKecamatanProperties) => {
    setSelectedKecamatan(properties);
    setActiveKecamatan(properties.id_kecamatan);
  }, []);

  // Handle search autocomplete click
  const handleSelectUmkmFromSearch = useCallback((umkm: Umkm) => {
    if (umkm.latitude && umkm.longitude) {
      // Ensure category toggle is active
      if (umkm.kategori?.nama_kategori) {
        setActiveKategori((prev) => ({
          ...prev,
          [umkm.kategori!.nama_kategori]: true,
        }));
      }

      // If UMKM belongs to a different kecamatan than current filter, reset kecamatan filter
      if (activeKecamatan && umkm.kecamatan?.id_kecamatan && activeKecamatan !== umkm.kecamatan.id_kecamatan) {
        setActiveKecamatan(null);
        setSelectedKecamatan(null);
      }

      setFlyToCoords({
        center: [umkm.latitude, umkm.longitude],
        zoom: 16,
      });
      setSelectedUmkmId(umkm.id_umkm);
    }
  }, [activeKecamatan]);

  // Reset all filters (kecamatan + categories)
  const handleResetAllFilters = useCallback(() => {
    setActiveKecamatan(null);
    setSelectedKecamatan(null);
    const allActive: ActiveKategoriState = {};
    kategoriList.forEach((k) => {
      allActive[k.nama_kategori] = true;
    });
    setActiveKategori(allActive);
  }, [kategoriList]);

  // Compute count of active filtered UMKMs
  const filteredUmkmCount = useMemo(() => {
    return umkmList.filter((u) => {
      const katName = u.kategori?.nama_kategori;
      if (katName && activeKategori && activeKategori[katName] === false) return false;
      if (activeKecamatan && u.kecamatan?.id_kecamatan !== activeKecamatan) return false;
      return true;
    }).length;
  }, [umkmList, activeKategori, activeKecamatan]);

  return (
    <div className="peta-layout">
      <Helmet>
        <title>Peta Digital UMKM & Klastering — SIGAP UMKM KBB</title>
        <meta name="description" content="Eksplorasi peta interaktif sebaran UMKM dan hasil analisis K-Means wilayah Kabupaten Bandung Barat." />
      </Helmet>

      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Floating Top Controls */}
      <div className={`floating-top-controls ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <button
          className="btn-toggle-sidebar"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          title={isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        <Link to="/" className="btn-back-floating">
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* ===== LEFT SIDEBAR ===== */}
      <aside className={`peta-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Brand Header */}
        <div className="sidebar-header-new">
          <div className="sidebar-logo-flex">
            <div className="sidebar-icon-circle">
              <MapPin size={20} color="#ffffff" />
            </div>
            <h2 className="sidebar-brand-title">SIGAP UMKM</h2>
            <button
              className="btn-sidebar-close"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Tutup sidebar"
            >
              <X size={20} />
            </button>
          </div>
          <span className="sidebar-top-pill">WEBGIS SIGAP UMKM KABUPATEN BANDUNG BARAT</span>
        </div>

        <div className="sidebar-body">
          {/* Section 1: Search */}
          <div className="sidebar-block">
            <MapSearchBar
              onSelectUmkm={handleSelectUmkmFromSearch}
              activeKecamatan={activeKecamatan}
            />
          </div>

          {/* Section 2: Wilayah & Kategori */}
          <div className="sidebar-block">
            <MapFilter
              kecamatanList={kecamatanList}
              kategoriList={kategoriList}
              activeKategori={activeKategori}
              onKategoriToggle={handleKategoriToggle}
              activeKecamatan={activeKecamatan}
              onKecamatanChange={handleKecamatanChange}
              onResetAllCategories={handleResetAllFilters}
            />
          </div>

          {/* Section 3: Selected Kecamatan Info Card */}
          {selectedKecamatan && (
            <div className="sidebar-block">
              <div className="kecamatan-card-new">
                <div className="kec-card-title-row">
                  <Layers size={20} color="#00684A" />
                  <h3 className="kec-card-title">Kecamatan {selectedKecamatan.nama_kecamatan}</h3>
                </div>

                <div className="kec-cluster-pill">
                  Cluster {selectedKecamatan.label_cluster ?? '—'}
                </div>

                {(() => {
                  const totalUmkmKecamatan = umkmList.filter(u => u.kecamatan?.id_kecamatan === selectedKecamatan.id_kecamatan).length;
                  const isPerluValidasi = selectedKecamatan.flag_imputasi === 'PERLU_VALIDASI';
                  
                  const cId = selectedKecamatan.label_cluster;
                  let levelPertumbuhan = 'Wilayah Pertumbuhan UMKM Skala Menengah';
                  let levelColor = '#eab308';

                  if (isPerluValidasi) {
                    levelPertumbuhan = 'Estimasi Potensi Tentatif (Perlu Validasi BPS)';
                    levelColor = '#f59e0b';
                  } else if (cId === 3 || cId === 2) {
                    levelPertumbuhan = 'Wilayah Pusat Pertumbuhan & Konsentrasi UMKM Terbesar';
                    levelColor = '#00684A';
                  } else if (cId === 0) {
                    levelPertumbuhan = 'Fokus Lokasi Prioritas Program Bantuan & Pembinaan';
                    levelColor = '#e11d48';
                  }

                  return (
                    <div className="kec-card-body">
                      <span className="kec-label-mini">KONSENTRASI & PERTUMBUHAN</span>
                      <p className="kec-value-heading" style={{ color: levelColor }}>
                        {levelPertumbuhan}
                      </p>
                      <p className="kec-value-sub">
                        Terdapat <strong>{totalUmkmKecamatan} UMKM</strong> terdata di kecamatan ini.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Section 4: UMKM Terpopuler Card */}
          <div className="sidebar-block">
            <h4 className="filter-label">UMKM Terpopuler</h4>
            <div className="sidebar-white-card">
              {kategoriList.map((kat) => {
                const katName = kat.nama_kategori;
                let circleBg = '#f1f5f9';
                let iconColor = '#64748b';
                let iconComponent = <Store size={14} />;

                const name = katName.toLowerCase();
                if (name.includes('makanan') || name.includes('kuliner') || name.includes('pangan')) {
                  circleBg = '#ffedd5';
                  iconColor = '#ea580c';
                  iconComponent = <Utensils size={14} />;
                } else if (name.includes('kerajinan') || name.includes('craft') || name.includes('kriya')) {
                  circleBg = '#f3e8ff';
                  iconColor = '#7e22ce';
                  iconComponent = <Palette size={14} />;
                } else if (name.includes('fashion') || name.includes('tekstil') || name.includes('pakaian')) {
                  circleBg = '#fce7f3';
                  iconColor = '#db2777';
                  iconComponent = <Shirt size={14} />;
                } else if (name.includes('jasa') || name.includes('layanan')) {
                  circleBg = '#dbeafe';
                  iconColor = '#2563eb';
                  iconComponent = <Wrench size={14} />;
                }

                return (
                  <div key={kat.id_kategori} className="popular-cat-item">
                    <div className="popular-icon-circle" style={{ backgroundColor: circleBg, color: iconColor }}>
                      {iconComponent}
                    </div>
                    <span className="popular-cat-name">{katName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Legenda Klaster Card */}
          <div className="sidebar-block">
            <MapLegend clusterData={clusterData} />
          </div>
        </div>

        {/* Sidebar Footer Result Count */}
        <div className="sidebar-footer-bar">
          <span className="result-count-text">
            Menampilkan <strong>{filteredUmkmCount}</strong> hasil
          </span>
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="btn-reset-filter"
          >
            Reset Filter
          </button>
        </div>
      </aside>

      {/* ===== MAIN MAP AREA ===== */}
      <main className="peta-main" style={{ position: 'relative' }}>
        {/* Map rendered immediately for instant LCP Tile Loading */}
        <WebGisMap
          clusterData={clusterData}
          umkmList={umkmList}
          activeKategori={activeKategori}
          activeKecamatan={activeKecamatan}
          onKecamatanSelect={handleKecamatanSelect}
          selectedKecamatanId={activeKecamatan ?? selectedKecamatan?.id_kecamatan}
          selectedUmkmId={selectedUmkmId}
          flyToCoords={flyToCoords}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Floating Loading Overlay */}
        {loading && (
          <div 
            className="map-loading-overlay"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#00684A',
              fontWeight: 600
            }}
          >
            <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #cbd5e1', borderTopColor: '#00684A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: 16 }}>Mengambil Data Spasial...</p>
          </div>
        )}

        {/* Floating Weather Widget (Top-Right over Map) */}
        <div className="weather-widget-floating">
          <div className="weather-temp-wrap">
            <span className="weather-temp">23°C</span>
            <Sun size={22} className="weather-icon" />
          </div>
          <div className="weather-location">
            <span>Bandung Barat</span>
            <span className="weather-condition">Cerah</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetaPage;
