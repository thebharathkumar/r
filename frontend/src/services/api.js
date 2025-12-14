import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateInterests: (interests) => api.put('/user/interests', { interests }),
};

// Content API
export const contentAPI = {
  getFeed: (page = 1, limit = 20) =>
    api.get(`/content/feed?page=${page}&limit=${limit}`),
  getAllContent: (page = 1, limit = 20) =>
    api.get(`/content/all?page=${page}&limit=${limit}`),
};

export default api;
