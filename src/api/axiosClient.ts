import axios, { AxiosInstance } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle Rate Limiting (429) gracefully
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      const customMsg = error.response.data?.message || 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.';
      console.warn('[API Rate Limit Exceeded]:', customMsg);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

