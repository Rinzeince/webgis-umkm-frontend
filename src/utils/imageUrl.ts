/**
 * Utility helper to format image URLs dynamically.
 * Supports:
 * 1. Direct AWS S3 URLs (HTTPS)
 * 2. Backend storage images proxied via Vercel HTTPS reverse proxy
 * 3. Local development fallback (http://127.0.0.1:8000)
 */
export const formatImageUrl = (url?: string): string => {
  if (!url) return '';

  // 1. If it's already an HTTPS URL (AWS S3 / Cloud Storage / CDN), use directly
  if (url.startsWith('https://')) {
    return url;
  }

  // 2. If it's an HTTP URL containing /storage/ (e.g. from EC2 backend http://47.129.191.121/storage/...)
  const storageIndex = url.indexOf('/storage/');
  if (storageIndex !== -1) {
    const storagePath = url.substring(storageIndex);
    return import.meta.env.PROD ? storagePath : `http://127.0.0.1:8000${storagePath}`;
  }

  // 3. If it's a relative path like '/storage/...' or 'artikel/thumbnail/...'
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  if (cleanPath.startsWith('/storage/')) {
    return import.meta.env.PROD ? cleanPath : `http://127.0.0.1:8000${cleanPath}`;
  }

  const fullPath = `/storage${cleanPath}`;
  return import.meta.env.PROD ? fullPath : `http://127.0.0.1:8000${fullPath}`;
};
