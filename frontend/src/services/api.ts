import axios from 'axios';

// Configuração base da API
const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  }
};

export const characterService = {
  getAll: async () => {
    const response = await api.get('/api/characters');
    return response.data;
  },
  
  create: async (characterData: any) => {
    const response = await api.post('/api/characters', characterData);
    return response.data;
  }
};

export default api;
