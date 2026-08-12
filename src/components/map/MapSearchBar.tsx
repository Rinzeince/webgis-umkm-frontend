import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { searchUmkm } from '../../api/webgisApi';
import { Umkm } from '../../types/webgis';

interface MapSearchBarProps {
  onSelectUmkm: (umkm: Umkm) => void;
  activeKecamatan?: number | null;
}

/**
 * MapSearchBar — Search bar component rendered inside the sidebar.
 * Filters results by activeKecamatan if a kecamatan filter is selected.
 */
const MapSearchBar: React.FC<MapSearchBarProps> = ({ onSelectUmkm, activeKecamatan }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Umkm[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounced search filtered by activeKecamatan
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const data = await searchUmkm(value.trim());
          let items = data.data || [];

          // Filter search results by active kecamatan if selected
          if (activeKecamatan) {
            items = items.filter((u) => u.kecamatan?.id_kecamatan === activeKecamatan);
          }

          setResults(items);
          setIsOpen(true);
        } catch (err) {
          console.error('Search failed:', err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [activeKecamatan]
  );

  // Click result → notify parent
  const handleSelect = (umkm: Umkm) => {
    if (onSelectUmkm) {
      onSelectUmkm(umkm);
    }
    setQuery(umkm.nama_umkm);
    setIsOpen(false);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sidebar-search-container" ref={containerRef}>
      <div className="sidebar-search-input-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="sidebar-search-input"
          placeholder="Cari UMKM, lokasi..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {query && (
          <button className="search-clear" onClick={handleClear} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="sidebar-search-results">
          {loading && <li className="search-loading">Mencari...</li>}
          {!loading && results.length === 0 && (
            <li className="search-empty">
              {activeKecamatan ? 'Tidak ditemukan di kecamatan ini' : 'Tidak ditemukan'}
            </li>
          )}
          {!loading &&
            results.map((umkm) => (
              <li
                key={umkm.id_umkm}
                className="search-result-item"
                onClick={() => handleSelect(umkm)}
              >
                <span className="result-name">{umkm.nama_umkm}</span>
                <span className="result-meta">
                  {umkm.kategori?.nama_kategori} · Kec. {umkm.kecamatan?.nama_kecamatan}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(MapSearchBar);
