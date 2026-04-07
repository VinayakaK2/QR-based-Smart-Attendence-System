import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept responses to log CORS or Network errors clearly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error') {
      console.error('CORS or Network Error: Make sure your frontend origin matches the backend allow_origins list, and the server is running.');
    }
    return Promise.reject(error);
  }
);

// ── Auth ────────────────────────────────────────────
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// ── Sections ─────────────────────────────────────────
export const createSection = (data) => api.post('/section/create', data);
export const getSections = () => api.get('/section/all');

// ── Sessions ─────────────────────────────────────────
export const startSession = (data) => api.post('/session/start', data);
export const endSession = (sessionId) => api.post(`/session/end/${sessionId}`);
export const getMySessions = () => api.get('/session/my-sessions');

// ── Attendance ────────────────────────────────────────
export const markAttendance = (data) => api.post('/attendance/mark', data);
export const getSessionAttendance = (sessionId) => api.get(`/attendance/session/${sessionId}`);
export const getMyHistory = () => api.get('/attendance/my-history');
