import axios from 'axios';

// Yahan https:// aur /api ki spacing theek kar di hai
const API = axios.create({
  baseURL: 'https://mern-backend-production-44b9.up.railway.app/api', 
});

// Request interceptor — token attach karo
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 handle karo (auth endpoints ko CHHOR ke)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const authUrls = ['/users/login', '/users/register', '/users/forgot-password', '/users/reset-password'];
    const requestUrl = error.config?.url || '';
    const isAuth = authUrls.some(url => requestUrl.includes(url));

    if (error.response?.status === 401 && !isAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');

      const currentPath = window.location.pathname;
      const authPages = ['/login', '/signup', '/register', '/forgot-password'];
      const isAuthPage = authPages.some(p => currentPath.startsWith(p));

      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;