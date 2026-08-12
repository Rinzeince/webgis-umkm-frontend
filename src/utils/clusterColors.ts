import L from 'leaflet';

/**
 * Cluster & Sector Color Scheme
 * Synchronized with Admin Filament dashboard color badges.
 */

// K-Means Cluster Colors (fill for polygon choropleth)
export const CLUSTER_COLORS: Record<number, string> = {
  0: '#22c55e', // Green
  1: '#3b82f6', // Blue
  2: '#eab308', // Yellow
  3: '#ef4444', // Red
  4: '#a855f7', // Purple
};

// Lighter fill for polygon (with opacity applied separately)
export const CLUSTER_FILL_OPACITY = 0.35;

// Cluster label display names
export const CLUSTER_LABELS: Record<number, string> = {
  0: 'Kecamatan Cluster 0',
  1: 'Kecamatan Cluster 1',
  2: 'Kecamatan Cluster 2',
  3: 'Kecamatan Cluster 3',
  4: 'Kecamatan Cluster 4',
};

// UMKM Kategori Marker Colors (synced with KategoriUmkmSeeder warna_marker)
export const KATEGORI_COLORS: Record<string, string> = {
  Makanan: '#F97316',   // Orange
  Kerajinan: '#8B5CF6', // Purple
  Fashion: '#EC4899',   // Pink
  Jasa: '#3B82F6',      // Blue
  Lainnya: '#6B7280',   // Gray
};

// Get cluster color with fallback
export function getClusterColor(label: number): string {
  return CLUSTER_COLORS[label] ?? '#6B7280';
}

// Get kategori color with fallback
export function getKategoriColor(namaKategori: string): string {
  if (!namaKategori) return '#6B7280';
  const key = namaKategori.trim().toLowerCase();
  if (key.includes('makanan') || key.includes('kuliner') || key.includes('pangan')) return '#F97316'; // Orange
  if (key.includes('kerajinan') || key.includes('craft') || key.includes('kriya')) return '#8B5CF6';  // Purple
  if (key.includes('fashion') || key.includes('tekstil') || key.includes('pakaian')) return '#EC4899';   // Pink
  if (key.includes('jasa') || key.includes('layanan')) return '#3B82F6';      // Blue
  return '#6B7280'; // Gray
}

// Cache of Leaflet custom div icons per category color
const iconCache: Record<string, L.DivIcon> = {};

/**
 * Creates custom marker icon for Leaflet map based on category color.
 * Allows easy manual replacement with custom image/SVG icons in public/icons/
 */
export function createCustomUmkmIcon(namaKategori: string, color?: string | null): L.DivIcon {
  const customColor = color || getKategoriColor(namaKategori);
  const cacheKey = `${namaKategori}-${customColor}`;

  if (iconCache[cacheKey]) {
    return iconCache[cacheKey];
  }

  const icon = L.divIcon({
    className: 'custom-umkm-marker-wrap',
    html: `
      <div class="custom-umkm-pin" style="--pin-color: ${customColor};">
        <span class="custom-umkm-pin-inner"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  iconCache[cacheKey] = icon;
  return icon;
}
