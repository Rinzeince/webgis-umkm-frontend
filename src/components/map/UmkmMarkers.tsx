import React, { useMemo, useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, FileText, Utensils, Palette, Shirt, Wrench, Store } from 'lucide-react';
import { getKategoriColor, createCustomUmkmIcon } from '../../utils/clusterColors';
import { Umkm, ActiveKategoriState } from '../../types/webgis';

interface UmkmMarkersProps {
  umkmList: Umkm[];
  activeKategori: ActiveKategoriState;
  activeKecamatan?: number | null;
  selectedUmkmId?: number | null;
}

const getCategoryPopupDetails = (catName: string) => {
  const name = catName.toLowerCase();
  if (name.includes('makanan') || name.includes('kuliner') || name.includes('pangan')) {
    return { bg: '#ffedd5', color: '#ea580c', icon: <Utensils size={20} /> };
  }
  if (name.includes('kerajinan') || name.includes('craft') || name.includes('kriya')) {
    return { bg: '#f3e8ff', color: '#7e22ce', icon: <Palette size={20} /> };
  }
  if (name.includes('fashion') || name.includes('tekstil') || name.includes('pakaian')) {
    return { bg: '#fce7f3', color: '#db2777', icon: <Shirt size={20} /> };
  }
  if (name.includes('jasa') || name.includes('layanan')) {
    return { bg: '#dbeafe', color: '#2563eb', icon: <Wrench size={20} /> };
  }
  return { bg: '#f1f5f9', color: '#64748b', icon: <Store size={20} /> };
};

const UmkmMarkers: React.FC<UmkmMarkersProps> = ({
  umkmList,
  activeKategori,
  activeKecamatan,
  selectedUmkmId,
}) => {
  const navigate = useNavigate();
  const markerRefs = useRef<Record<number, L.Marker>>({});

  const filtered = useMemo(() => {
    if (!umkmList || umkmList.length === 0) return [];

    return umkmList.filter((u) => {
      const katName = u.kategori?.nama_kategori;
      if (katName && activeKategori && activeKategori[katName] === false) {
        return false;
      }
      if (activeKecamatan && u.kecamatan?.id_kecamatan !== activeKecamatan) {
        return false;
      }
      return u.latitude && u.longitude;
    });
  }, [umkmList, activeKategori, activeKecamatan]);

  useEffect(() => {
    if (selectedUmkmId && markerRefs.current[selectedUmkmId]) {
      const marker = markerRefs.current[selectedUmkmId];
      const timer = setTimeout(() => {
        marker.openPopup();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [selectedUmkmId, filtered]);

  if (filtered.length === 0) return null;

  return (
    <>
      {filtered.map((umkm) => {
        const katName = umkm.kategori?.nama_kategori || 'Lainnya';
        const color = umkm.kategori?.warna_marker || getKategoriColor(katName);
        const customIcon = createCustomUmkmIcon(katName, color);
        const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${umkm.latitude},${umkm.longitude}`;
        const popupDetails = getCategoryPopupDetails(katName);
        const kecName = umkm.kecamatan?.nama_kecamatan || 'Bandung Barat';

        return (
          <Marker
            key={umkm.id_umkm}
            position={[umkm.latitude, umkm.longitude]}
            icon={customIcon}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[umkm.id_umkm] = ref;
              }
            }}
          >
            <Popup className="umkm-popup-custom" maxWidth={320} minWidth={260}>
              <div className="popup-card-custom">
                {/* Header Row */}
                <div className="popup-top-row">
                  <div
                    className="popup-icon-badge"
                    style={{ backgroundColor: popupDetails.bg, color: popupDetails.color }}
                  >
                    {popupDetails.icon}
                  </div>

                  <div className="popup-title-block">
                    <h3 className="popup-store-name">{umkm.nama_umkm}</h3>
                    <div className="popup-category-sub">
                      <span className="cat-dot" style={{ backgroundColor: color }} />
                      <span>{katName}</span>
                    </div>
                  </div>
                </div>

                {/* Address Box */}
                <div className="popup-address-box">
                  <MapPin size={16} className="pin-icon" />
                  <span className="address-text">
                    {umkm.alamat_lengkap ? umkm.alamat_lengkap : `Kecamatan ${kecName}`}
                    {kecName && !umkm.alamat_lengkap?.includes(kecName) && `, ${kecName}`}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="popup-btn-stack">
                  <a
                    href={gmapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-popup-gmaps"
                  >
                    <Navigation size={16} /> Google Maps
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate(`/umkm/${umkm.id_umkm}`)}
                    className="btn-popup-detail"
                  >
                    <FileText size={16} /> Lihat Halaman Detail
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default React.memo(UmkmMarkers);
