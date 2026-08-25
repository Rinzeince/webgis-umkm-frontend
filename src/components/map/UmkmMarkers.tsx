import React, { useMemo, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { useNavigate } from 'react-router-dom';
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
    return {
      bg: '#ffedd5',
      color: '#ea580c',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M18 22V11"/><path d="M6 2v10a3 3 0 0 0 3 3 3 3 0 0 0 3-3V2"/><path d="M6 22V15"/></svg>`,
    };
  }
  if (name.includes('kerajinan') || name.includes('craft') || name.includes('kriya')) {
    return {
      bg: '#f3e8ff',
      color: '#7e22ce',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    };
  }
  if (name.includes('fashion') || name.includes('tekstil') || name.includes('pakaian')) {
    return {
      bg: '#fce7f3',
      color: '#db2777',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
    };
  }
  if (name.includes('jasa') || name.includes('layanan')) {
    return {
      bg: '#dbeafe',
      color: '#2563eb',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    };
  }
  return {
    bg: '#f1f5f9',
    color: '#64748b',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`,
  };
};

const escapeHtml = (unsafe: string): string => {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Creates dynamic green cluster icon based on density:
 * - Low (< 10): Light vibrant emerald
 * - Medium (10 - 24): Medium emerald
 * - High (25 - 49): Deep brand green
 * - Very High (>= 50): Dark forest green
 */
const createCustomClusterIcon = (cluster: L.MarkerCluster): L.DivIcon => {
  const count = cluster.getChildCount();
  let clusterClass = 'cluster-low';
  let outerSize = 36;
  let innerSize = 26;
  let fontSize = 12;

  if (count >= 50) {
    clusterClass = 'cluster-very-high';
    outerSize = 54;
    innerSize = 40;
    fontSize = 15;
  } else if (count >= 25) {
    clusterClass = 'cluster-high';
    outerSize = 48;
    innerSize = 36;
    fontSize = 14;
  } else if (count >= 10) {
    clusterClass = 'cluster-medium';
    outerSize = 42;
    innerSize = 31;
    fontSize = 13;
  }

  return L.divIcon({
    html: `
      <div class="cluster-bubble ${clusterClass}" style="width: ${outerSize}px; height: ${outerSize}px;">
        <div class="cluster-bubble-inner" style="width: ${innerSize}px; height: ${innerSize}px; font-size: ${fontSize}px;">
          ${count}
        </div>
      </div>
    `,
    className: 'custom-cluster-marker',
    iconSize: L.point(outerSize, outerSize),
    iconAnchor: L.point(outerSize / 2, outerSize / 2),
  });
};

const UmkmMarkers: React.FC<UmkmMarkersProps> = ({
  umkmList,
  activeKategori,
  activeKecamatan,
  selectedUmkmId,
}) => {
  const map = useMap();
  const navigate = useNavigate();
  const markerRefs = useRef<Map<number, L.Marker>>(new Map());
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

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

  // Initialize & synchronize MarkerClusterGroup on Map
  useEffect(() => {
    if (!map) return;

    // Create MarkerClusterGroup with customized options
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 17,
      animate: true,
      chunkedLoading: true,
      iconCreateFunction: createCustomClusterIcon,
    });

    clusterGroupRef.current = clusterGroup;
    markerRefs.current.clear();

    const markersToAdd: L.Marker[] = [];

    filtered.forEach((umkm) => {
      const katName = umkm.kategori?.nama_kategori || 'Lainnya';
      const color = umkm.kategori?.warna_marker || getKategoriColor(katName);
      const customIcon = createCustomUmkmIcon(katName, color);
      const popupDetails = getCategoryPopupDetails(katName);
      const kecName = umkm.kecamatan?.nama_kecamatan || 'Bandung Barat';
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${umkm.latitude},${umkm.longitude}`;
      const escapedNama = escapeHtml(umkm.nama_umkm);
      const escapedAlamat = umkm.alamat_lengkap
        ? escapeHtml(umkm.alamat_lengkap)
        : `Kecamatan ${escapeHtml(kecName)}`;

      const popupHtml = `
        <div class="popup-card-custom">
          <!-- Header Row -->
          <div class="popup-top-row">
            <div class="popup-icon-badge" style="background-color: ${popupDetails.bg}; color: ${popupDetails.color};">
              ${popupDetails.svg}
            </div>
            <div class="popup-title-block">
              <h3 class="popup-store-name">${escapedNama}</h3>
              <div class="popup-category-sub">
                <span class="cat-dot" style="background-color: ${color};"></span>
                <span>${escapeHtml(katName)}</span>
              </div>
            </div>
          </div>

          <!-- Address Box -->
          <div class="popup-address-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-icon"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="address-text">
              ${escapedAlamat}${kecName && !umkm.alamat_lengkap?.includes(kecName) ? `, ${escapeHtml(kecName)}` : ''}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="popup-btn-stack">
            <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-popup-gmaps">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Google Maps
            </a>
            <button type="button" class="btn-popup-detail" data-umkm-id="${umkm.id_umkm}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              Lihat Halaman Detail
            </button>
          </div>
        </div>
      `;

      const marker = L.marker([umkm.latitude, umkm.longitude], {
        icon: customIcon,
      });

      marker.bindPopup(popupHtml, {
        className: 'umkm-popup-custom',
        maxWidth: 320,
        minWidth: 260,
      });

      // Handle popup detail button click with client-side React navigation
      marker.on('popupopen', (e) => {
        const popupElement = e.popup.getElement();
        if (popupElement) {
          const detailBtn = popupElement.querySelector<HTMLButtonElement>('.btn-popup-detail');
          if (detailBtn) {
            detailBtn.onclick = (evt) => {
              evt.preventDefault();
              navigate(`/umkm/${umkm.id_umkm}`);
            };
          }
        }
      });

      markerRefs.current.set(umkm.id_umkm, marker);
      markersToAdd.push(marker);
    });

    clusterGroup.addLayers(markersToAdd);
    map.addLayer(clusterGroup);

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current.clearLayers();
        clusterGroupRef.current = null;
      }
    };
  }, [map, filtered, navigate]);

  // Handle zooming & opening popup when an item is selected (e.g. from search bar)
  useEffect(() => {
    if (!selectedUmkmId || !clusterGroupRef.current) return;

    const targetMarker = markerRefs.current.get(selectedUmkmId);
    if (targetMarker && clusterGroupRef.current.hasLayer(targetMarker)) {
      const timer = setTimeout(() => {
        clusterGroupRef.current?.zoomToShowLayer(targetMarker, () => {
          targetMarker.openPopup();
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [selectedUmkmId, filtered]);

  return null;
};

export default React.memo(UmkmMarkers);
