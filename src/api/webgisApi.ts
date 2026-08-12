import axiosClient from './axiosClient';
import {
  HasilCluster,
  Umkm,
  SearchUmkmResponse,
  KategoriUmkm,
  Kecamatan,
} from '../types/webgis';

/**
 * GET /api/v1/cluster
 * Cluster assignment for 16 kecamatan (published analysis).
 */
export async function getClusterData(): Promise<HasilCluster[]> {
  const { data } = await axiosClient.get<{ data: HasilCluster[] }>('/cluster');
  return data.data;
}

/**
 * GET /api/v1/umkm
 * List UMKM aktif with optional filters.
 */
export async function getUmkmList(params: Record<string, any> = {}): Promise<Umkm[]> {
  const { data } = await axiosClient.get<{ data: Umkm[] }>('/umkm', {
    params: { ...params, per_page: 100 },
  });
  return data.data;
}

/**
 * GET /api/v1/umkm/{id}
 * Single UMKM detail information.
 */
export async function getUmkmDetail(id: number | string): Promise<Umkm> {
  const { data } = await axiosClient.get<{ data: Umkm }>(`/umkm/${id}`);
  return data.data;
}

/**
 * GET /api/v1/umkm/search?q=...
 * Fast search UMKM by name/address.
 */
export async function searchUmkm(query: string, limit = 15): Promise<SearchUmkmResponse> {
  const { data } = await axiosClient.get<SearchUmkmResponse>('/umkm/search', {
    params: { q: query, limit },
  });
  return data;
}

/**
 * GET /api/v1/kategori-umkm
 * List 5 kategori UMKM with marker colors.
 */
export async function getKategoriUmkm(): Promise<KategoriUmkm[]> {
  const { data } = await axiosClient.get<{ data: KategoriUmkm[] }>('/kategori-umkm');
  return data.data;
}

/**
 * GET /api/v1/kecamatan
 * List 16 kecamatan.
 */
export async function getKecamatanList(): Promise<Kecamatan[]> {
  const { data } = await axiosClient.get<{ data: Kecamatan[] }>('/kecamatan');
  return data.data;
}

/**
 * GET /api/v1/statistik
 * Dashboard statistics summary.
 */
export async function getStatistik(): Promise<any> {
  const { data } = await axiosClient.get('/statistik');
  return data;
}

/**
 * GET /api/v1/artikel
 * List articles & news with search & pagination params.
 */
export async function getArtikelList(params: Record<string, any> = {}): Promise<any[]> {
  try {
    const { data } = await axiosClient.get<{ data: any[] }>('/artikel', { params });
    return data.data || [];
  } catch {
    return [];
  }
}
