/**
 * TypeScript Type Definitions for WebGIS UMKM KBB
 */

export interface Kecamatan {
  id_kecamatan: number;
  nama_kecamatan: string;
  geojson_path?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface KategoriUmkm {
  id_kategori: number;
  nama_kategori: string;
  warna_marker?: string | null;
}

export interface Umkm {
  id_umkm: number;
  nama_umkm: string;
  alamat_lengkap?: string | null;
  latitude: number;
  longitude: number;
  foto_url?: string | null;
  kontak?: string | null;
  status_operasional: 'aktif' | 'nonaktif';
  jam_buka?: string | null;
  jam_tutup?: string | null;
  jam_operasional?: string | null;
  kecamatan?: {
    id_kecamatan: number;
    nama_kecamatan: string;
  };
  kategori?: {
    id_kategori: number;
    nama_kategori: string;
    warna_marker?: string | null;
  };
}

export interface HasilCluster {
  id_kecamatan: number;
  nama_kecamatan?: string;
  label_cluster: number;
  interpretasi?: string | null;
  sektor_top1?: string | null;
  sektor_top2?: string | null;
  sektor_bottom1?: string | null;
  sektor_bottom2?: string | null;
  ranking_sektor_5?: Record<string, number> | null;
  flag_imputasi?: string | null;
}

export interface Analisis {
  id_analisis: number;
  tanggal_analisis: string;
  k_optimal: number;
  nilai_silhouette?: number | null;
  nilai_dbi?: number | null;
  is_published: boolean;
  status_job: string;
}

export interface SearchUmkmResponse {
  query: string;
  total: number;
  data: Umkm[];
}

export interface FlyToCoords {
  center: [number, number];
  zoom?: number;
}

export type ActiveKategoriState = Record<string, boolean>;

export interface GeoJsonProperties {
  id_kecamatan: number;
  nama_kecamatan: string;
  kd_propinsi?: string;
  kd_dati2?: string;
  kd_kecamatan?: string;
  [key: string]: any;
}

export type MergedKecamatanProperties = GeoJsonProperties & Partial<HasilCluster>;
