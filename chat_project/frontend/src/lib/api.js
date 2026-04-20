import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8005/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const res = await axios.post('http://localhost:8005/api/users/login/refresh/', { refresh });
          localStorage.setItem('access', res.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
