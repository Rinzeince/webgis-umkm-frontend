import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import { getClusterColor, CLUSTER_FILL_OPACITY } from '../../utils/clusterColors';
import {
  HasilCluster,
  GeoJsonProperties,
  MergedKecamatanProperties,
} from '../../types/webgis';

// Start fetching GeoJSON at module load time (before React mounts),
// so it overlaps with API calls instead of waiting for component render.
const geojsonPromise: Promise<FeatureCollection<Geometry, GeoJsonProperties>> =
  fetch('/geojson/kecamatan_kbb.geojson').then((res) => res.json());


interface GeoJsonLayerProps {
  clusterData: HasilCluster[];
  onKecamatanSelect: (properties: MergedKecamatanProperties) => void;
  selectedKecamatanId?: number | null;
}

/**
 * GeoJsonLayer — Renders 16 kecamatan polygons colored by K-Means cluster.
 * Optimized with useMemo & useCallback for lag-free performance.
 */
const GeoJsonLayer: React.FC<GeoJsonLayerProps> = ({
  clusterData,
  onKecamatanSelect,
  selectedKecamatanId,
}) => {
  const [geojson, setGeojson] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const highlightedRef = useRef<L.Layer | null>(null);
  const map = useMap();

  // Load GeoJSON from eagerly-started module-level fetch
  useEffect(() => {
    geojsonPromise
      .then((data) => setGeojson(data))
      .catch((err) => console.error('Failed to load GeoJSON:', err));
  }, []);

  // Memoized lookup map: id_kecamatan -> cluster data
  const clusterLookup = useMemo(() => {
    const lookup: Record<number, HasilCluster> = {};
    if (clusterData) {
      clusterData.forEach((c) => {
        lookup[c.id_kecamatan] = c;
      });
    }
    return lookup;
  }, [clusterData]);

  // Automatically highlight & fit bounds when selectedKecamatanId changes (from dropdown or click)
  useEffect(() => {
    if (!geoJsonRef.current) return;

    if (!selectedKecamatanId) {
      if (highlightedRef.current) {
        geoJsonRef.current.resetStyle(highlightedRef.current);
        highlightedRef.current = null;
      }
      return;
    }

    geoJsonRef.current.eachLayer((layer: any) => {
      if (layer.feature && layer.feature.properties && layer.feature.properties.id_kecamatan === selectedKecamatanId) {
        if (highlightedRef.current && highlightedRef.current !== layer && geoJsonRef.current) {
          geoJsonRef.current.resetStyle(highlightedRef.current);
        }

        layer.setStyle({
          weight: 4,
          color: '#facc15',
          fillOpacity: 0.55,
        });

        if (layer.bringToFront) {
          layer.bringToFront();
        }
        highlightedRef.current = layer;

        if (layer.getBounds) {
          map.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 13 });
        }
      }
    });
  }, [selectedKecamatanId, map, geojson]);

  // Style each polygon based on cluster label
  const style = useCallback(
    (feature?: Feature<Geometry, GeoJsonProperties>): L.PathOptions => {
      if (!feature) return {};
      const idKec = feature.properties.id_kecamatan;
      const cluster = clusterLookup[idKec];
      const label = cluster?.label_cluster ?? 0;
      const isSelected = idKec === selectedKecamatanId;

      return {
        fillColor: getClusterColor(label),
        fillOpacity: isSelected ? 0.55 : CLUSTER_FILL_OPACITY,
        color: isSelected ? '#facc15' : '#374151',
        weight: isSelected ? 4 : 1.5,
        opacity: 1,
      };
    },
    [clusterLookup, selectedKecamatanId]
  );

  // Reset highlight on previously highlighted layer
  const resetHighlight = useCallback((layer: L.Layer) => {
    if (geoJsonRef.current) {
      geoJsonRef.current.resetStyle(layer);
    }
  }, []);

  // Interaction handlers for each polygon feature
  const onEachFeature = useCallback(
    (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
      const idKec = feature.properties.id_kecamatan;
      const namaKec = feature.properties.nama_kecamatan;
      const cluster = clusterLookup[idKec];

      // Tooltip with kecamatan name
      layer.bindTooltip(namaKec, {
        permanent: false,
        direction: 'center',
        className: 'kecamatan-tooltip',
      });

      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          const target = e.target;
          if (idKec !== selectedKecamatanId) {
            target.setStyle({
              weight: 3,
              color: '#f59e0b',
              fillOpacity: 0.45,
            });
          }
          if (target.getElement()) {
            target.getElement()!.style.cursor = 'pointer';
          }
        },

        mouseout: (e: L.LeafletMouseEvent) => {
          const target = e.target;
          if (idKec !== selectedKecamatanId) {
            resetHighlight(target);
          }
        },

        click: (e: L.LeafletMouseEvent) => {
          // Reset previous highlight
          if (highlightedRef.current && highlightedRef.current !== e.target) {
            resetHighlight(highlightedRef.current);
          }

          // Highlight current
          const target = e.target;
          target.setStyle({
            weight: 4,
            color: '#facc15',
            fillOpacity: 0.55,
          });
          if (target.bringToFront) {
            target.bringToFront();
          }
          highlightedRef.current = target;

          // Notify parent
          if (onKecamatanSelect) {
            onKecamatanSelect({
              ...feature.properties,
              ...(cluster || {}),
            });
          }

          // Fit bounds to selected kecamatan
          if (target.getBounds) {
            map.fitBounds(target.getBounds(), { padding: [50, 50], maxZoom: 13 });
          }
        },
      });
    },
    [clusterLookup, selectedKecamatanId, onKecamatanSelect, map, resetHighlight]
  );

  if (!geojson) return null;

  return (
    <GeoJSON
      key={`geojson-${selectedKecamatanId}-${clusterData?.length}`}
      ref={geoJsonRef}
      data={geojson}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

export default React.memo(GeoJsonLayer);
