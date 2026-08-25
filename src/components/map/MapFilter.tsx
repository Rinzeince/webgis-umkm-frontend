import React from 'react';
import { Utensils, Palette, Shirt, Wrench, Store, LayoutGrid } from 'lucide-react';
import { Kecamatan, KategoriUmkm, ActiveKategoriState } from '../../types/webgis';

interface MapFilterProps {
  kecamatanList: Kecamatan[];
  kategoriList: KategoriUmkm[];
  activeKategori: ActiveKategoriState;
  onKategoriToggle: (namaKategori: string) => void;
  activeKecamatan: number | null;
  onKecamatanChange: (idKecamatan: number | null) => void;
  onResetAllCategories?: () => void;
}

const getCategoryPillStyle = (catName: string, isActive: boolean) => {
  const name = catName.toLowerCase();
  if (name.includes('makanan') || name.includes('kuliner') || name.includes('pangan')) {
    return {
      border: '1.5px solid #fdba74',
      color: isActive ? '#ea580c' : '#fdba74',
      bg: isActive ? '#fff7ed' : '#ffffff',
    };
  }
  if (name.includes('kerajinan') || name.includes('craft') || name.includes('kriya')) {
    return {
      border: '1.5px solid #c084fc',
      color: isActive ? '#9333ea' : '#c084fc',
      bg: isActive ? '#faf5ff' : '#ffffff',
    };
  }
  if (name.includes('fashion') || name.includes('tekstil') || name.includes('pakaian')) {
    return {
      border: '1.5px solid #f472b6',
      color: isActive ? '#db2777' : '#f472b6',
      bg: isActive ? '#fdf2f8' : '#ffffff',
    };
  }
  if (name.includes('jasa') || name.includes('layanan')) {
    return {
      border: '1.5px solid #60a5fa',
      color: isActive ? '#2563eb' : '#60a5fa',
      bg: isActive ? '#eff6ff' : '#ffffff',
    };
  }
  return {
    border: '1.5px solid #94a3b8',
    color: isActive ? '#475569' : '#94a3b8',
    bg: isActive ? '#f8fafc' : '#ffffff',
  };
};

const getCategoryIcon = (catName: string) => {
  const name = catName.toLowerCase();
  if (name.includes('makanan') || name.includes('kuliner') || name.includes('pangan')) {
    return <Utensils size={14} className="cat-pill-icon" />;
  }
  if (name.includes('kerajinan') || name.includes('craft') || name.includes('kriya')) {
    return <Palette size={14} className="cat-pill-icon" />;
  }
  if (name.includes('fashion') || name.includes('tekstil') || name.includes('pakaian')) {
    return <Shirt size={14} className="cat-pill-icon" />;
  }
  if (name.includes('jasa') || name.includes('layanan')) {
    return <Wrench size={14} className="cat-pill-icon" />;
  }
  return <Store size={14} className="cat-pill-icon" />;
};

const MapFilter: React.FC<MapFilterProps> = ({
  kecamatanList = [],
  kategoriList = [],
  activeKategori = {},
  onKategoriToggle,
  activeKecamatan,
  onKecamatanChange,
  onResetAllCategories,
}) => {
  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      onKecamatanChange(null);
    } else {
      const id = parseInt(value, 10);
      onKecamatanChange(id);
    }
  };

  const isAllActive = Object.values(activeKategori).every((val) => val === true);

  return (
    <div className="filter-section-group">
      {/* Filter Wilayah */}
      <div className="filter-group">
        <h4 className="filter-label">Wilayah</h4>
        <div className="select-pill-wrap">
          <select
            className="filter-select-pill"
            value={activeKecamatan ?? ''}
            onChange={handleKecamatanChange}
          >
            <option value="">Semua Wilayah</option>
            {kecamatanList.map((kec) => (
              <option key={kec.id_kecamatan} value={kec.id_kecamatan}>
                {kec.nama_kecamatan}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kategori UMKM Pills */}
      <div className="filter-group">
        <h4 className="filter-label">Kategori</h4>
        <div className="category-pills-flex">
          <button
            type="button"
            className={`pill-cat-btn ${isAllActive ? 'active-all' : ''}`}
            onClick={() => onResetAllCategories && onResetAllCategories()}
          >
            <LayoutGrid size={14} className="cat-pill-icon" />
            <span>Semua</span>
          </button>

          {kategoriList.map((kat) => {
            const isActive = activeKategori[kat.nama_kategori] !== false;
            const styleProps = getCategoryPillStyle(kat.nama_kategori, isActive);

            return (
              <button
                key={kat.id_kategori}
                type="button"
                className="pill-cat-btn"
                onClick={() => onKategoriToggle && onKategoriToggle(kat.nama_kategori)}
                style={{
                  border: styleProps.border,
                  color: styleProps.color,
                  backgroundColor: styleProps.bg,
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {getCategoryIcon(kat.nama_kategori)}
                <span>{kat.nama_kategori}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MapFilter);
