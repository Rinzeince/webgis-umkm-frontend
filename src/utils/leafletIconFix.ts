/**
 * Fix Leaflet default marker icon paths broken by Vite/Webpack bundlers.
 * Must be imported once before rendering Leaflet markers.
 */
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

(L.Marker.prototype.options as any).icon = DefaultIcon;

export default DefaultIcon;
