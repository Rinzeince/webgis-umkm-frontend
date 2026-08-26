import React, { useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../utils/leafletIconFix';
import GeoJsonLayer from './GeoJsonLayer';
import UmkmMarkers from './UmkmMarkers';
import {
  HasilCluster,
  Umkm,
  ActiveKategoriState,
  FlyToCoords,
  MergedKecamatanProperties,
} from '../../types/webgis';

// Geographical bounds restricting pan area to Kabupaten Bandung Barat + surrounding margin
const KBB_MAX_BOUNDS: L.LatLngBoundsExpression = [
  [-7.25, 107.05], // South-West coordinates
  [-6.55, 107.90], // North-East coordinates
];

interface MapControllerProps {
  flyToCoords?: FlyToCoords | null;
  activeKecamatan?: number | null;
  isSidebarOpen?: boolean;
}

/**
 * Helper component inside MapContainer to dynamically control map viewport & canvas resizing.
 */
const MapController: React.FC<MapControllerProps> = ({ flyToCoords, activeKecamatan, isSidebarOpen }) => {
  const map = useMap();

  // Defer invalidateSize via rAF to avoid forced reflow during sidebar animation
  useEffect(() => {
    let rafId: number;
    const invalidate = () => {
      rafId = requestAnimationFrame(() => {
        map.invalidateSize({ animate: false });
      });
    };
    // Slight delay to allow CSS transition to start first
    const timer = setTimeout(invalidate, 320);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [isSidebarOpen, map]);

  useEffect(() => {
    if (flyToCoords) {
      map.flyTo(flyToCoords.center, flyToCoords.zoom || 16, { duration: 1.2 });
    }
  }, [flyToCoords, map]);

  useEffect(() => {
    if (activeKecamatan === null) {
      map.flyTo([-6.88, 107.52], 11, { duration: 1 });
    }
  }, [activeKecamatan, map]);

  return null;
};

interface WebGisMapProps {
  clusterData: HasilCluster[];
  umkmList: Umkm[];
  activeKategori: ActiveKategoriState;
  activeKecamatan: number | null;
  onKecamatanSelect: (properties: MergedKecamatanProperties) => void;
  selectedKecamatanId?: number | null;
  selectedUmkmId?: number | null;
  flyToCoords?: FlyToCoords | null;
  isSidebarOpen?: boolean;
}

/**
 * WebGisMap — Main map container component.
 * Configured with minZoom={10}, maxZoom={18}, maxBounds, and preferCanvas={true}.
 */
const WebGisMap: React.FC<WebGisMapProps> = ({
  clusterData,
  umkmList,
  activeKategori,
  activeKecamatan,
  onKecamatanSelect,
  selectedKecamatanId,
  selectedUmkmId,
  flyToCoords,
  isSidebarOpen,
}) => {
  return (
    <MapContainer
      center={[-6.88, 107.52]}
      zoom={11}
      minZoom={10}
      maxZoom={18}
      maxBounds={KBB_MAX_BOUNDS}
      maxBoundsViscosity={1.0}
      className="map-container"
      zoomControl={false}
      preferCanvas={true}
    >
      {/* Opsi 1: Esri Light Gray Canvas (Cadangan / Bebas API Key) */}
      {/* <TileLayer
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      /> */}

      {/* Opsi 2: CARTO Light Basemap (Aktif dengan API Key) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?api_key=eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfajEyNXN5cTEiLCJqdGkiOiJmOTllNmM4NiIsImV4cCI6MTgxOTI5NTUyMH0.6SkCRPb29xLr8sThlB0PnmIIbXtu0RHQ5JIpsXvv9Ak"
      />

      <ZoomControl position="bottomright" />

      <GeoJsonLayer
        clusterData={clusterData}
        onKecamatanSelect={onKecamatanSelect}
        selectedKecamatanId={selectedKecamatanId}
      />

      <UmkmMarkers
        umkmList={umkmList}
        activeKategori={activeKategori}
        activeKecamatan={activeKecamatan}
        selectedUmkmId={selectedUmkmId}
      />

      <MapController
        flyToCoords={flyToCoords}
        activeKecamatan={activeKecamatan}
        isSidebarOpen={isSidebarOpen}
      />
    </MapContainer>
  );
};

export default React.memo(WebGisMap);
