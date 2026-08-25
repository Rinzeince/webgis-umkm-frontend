/**
 * Utility helper to format image URLs dynamically.
 * Supports absolute URLs (AWS S3 / External CDN) and relative storage paths
 * based on current VITE_API_BASE_URL environment variable.
 */
export const formatImageUrl = (url?: string): string => {
  if (!url) return '';

  // If already a full URL (AWS S3 / HTTPS), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Derive backend origin from VITE_API_BASE_URL (stripping /api/v1 or /api)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
  const origin = apiBase.replace(/\/api(\/v\d+)?\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  if (cleanPath.startsWith('/storage/')) {
    return `${origin}${cleanPath}`;
  }

  return `${origin}/storage${cleanPath}`;
};
