import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshToken();
        const token = useAuthStore.getState().accessToken;
        if (token && originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  
  logout: () =>
    api.post('/auth/logout/'),
  
  refresh: () =>
    api.post('/auth/refresh/'),
  
  register: (userData: any) =>
    api.post('/auth/register/', userData),
};

export const vehicleAPI = {
  getAll: (params?: any) =>
    api.get('/vehicles/', { params }),
  
  getById: (id: number) =>
    api.get(`/vehicles/${id}/`),
  
  create: (data: any) =>
    api.post('/vehicles/', data),
  
  update: (id: number, data: any) =>
    api.put(`/vehicles/${id}/`, data),
  
  delete: (id: number) =>
    api.delete(`/vehicles/${id}/`),
  
  getLocation: (id: number) =>
    api.get(`/vehicles/${id}/location/`),
  
  getHistory: (id: number, params?: any) =>
    api.get(`/vehicles/${id}/history/`, { params }),
};

export const incidentAPI = {
  getAll: (params?: any) =>
    api.get('/incidents/', { params }),
  
  getById: (id: number) =>
    api.get(`/incidents/${id}/`),
  
  create: (data: any) =>
    api.post('/incidents/', data),
  
  update: (id: number, data: any) =>
    api.put(`/incidents/${id}/`, data),
  
  assign: (id: number, teamId: number) =>
    api.post(`/incidents/${id}/assign/`, { team_id: teamId }),
  
  resolve: (id: number) =>
    api.post(`/incidents/${id}/resolve/`),
};

export const analyticsAPI = {
  getTrafficStats: (params?: any) =>
    api.get('/analytics/traffic-stats/', { params }),
  
  getVehiclePerformance: (params?: any) =>
    api.get('/analytics/vehicle-performance/', { params }),
  
  getIncidentReports: (params?: any) =>
    api.get('/analytics/incident-reports/', { params }),
};