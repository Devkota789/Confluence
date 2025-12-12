import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Spaces
export const spacesAPI = {
  getAll: () => api.get('/spaces'),
  create: (data) => api.post('/spaces', data),
  addMember: (spaceId, userId) => api.put(`/spaces/${spaceId}/add-member`, { userId }),
};

// Pages
export const pagesAPI = {
  getBySpace: (spaceId, params) => api.get(`/pages/space/${spaceId}`, { params }),
  getById: (id) => api.get(`/pages/${id}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
  delete: (id) => api.delete(`/pages/${id}`),
};

// Admin
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  changeRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;