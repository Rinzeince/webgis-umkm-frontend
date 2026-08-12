import React, { useMemo } from 'react';
import { CLUSTER_COLORS, CLUSTER_LABELS } from '../../utils/clusterColors';
import { HasilCluster } from '../../types/webgis';

interface MapLegendProps {
  clusterData: HasilCluster[];
}

/**
 * MapLegend — Color legend for K-Means cluster labels.
 */
const MapLegend: React.FC<MapLegendProps> = ({ clusterData }) => {
  // Determine which cluster labels are actually present
  const sortedLabels = useMemo(() => {
    const activeLabels = new Set<number>();
    if (clusterData) {
      clusterData.forEach((c) => activeLabels.add(c.label_cluster));
    }
    return [...activeLabels].sort((a, b) => a - b);
  }, [clusterData]);

  if (sortedLabels.length === 0) return null;

  return (
    <div className="legend-section">
      <h4 className="filter-label">Legenda Klaster</h4>
      <div className="legend-items">
        {sortedLabels.map((label) => (
          <div key={label} className="legend-item">
            <span
              className="legend-swatch"
              style={{ backgroundColor: CLUSTER_COLORS[label] || '#6B7280' }}
            />
            <span className="legend-text">{CLUSTER_LABELS[label] || `Cluster ${label}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(MapLegend);
