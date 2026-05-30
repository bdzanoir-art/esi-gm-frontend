import axios from 'axios';

// ✅ Django backend URL
const API_BASE = 'http://localhost:8000';

// ─── Axios instance ───────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // required for Django session cookies
});

// ─── CSRF token interceptor (required for Django POST) ────
api.interceptors.request.use((config) => {
  const csrf = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1];
  if (csrf) {
    config.headers['X-CSRFToken'] = csrf;
  }
  return config;
});

// ─── Error handler ────────────────────────────────────────
const handleError = (error, context) => {
  if (error.response) {
    // Server responded with error status
    console.error(`[${context}] Server error:`, error.response.status, error.response.data);
  } else if (error.request) {
    // No response received
    console.error(`[${context}] No response from server. Is Django running on port 8000?`);
  } else {
    console.error(`[${context}] Request error:`, error.message);
  }
  throw error;
};

// ─── Requests API ─────────────────────────────────────────

// Get all requests
export const getRequests = async () => {
  try {
    const res = await api.get('/api/my-request/requests/');
    return res.data;
  } catch (error) {
    handleError(error, 'getRequests');
  }
};

// Create a new request
export const createRequest = async (requestData) => {
  try {
    const res = await api.post('/api/requests/', requestData);
    return res.data;
  } catch (error) {
    handleError(error, 'createRequest');
  }
};

// Get a single request by ID
export const getRequestById = async (id) => {
  try {
    const res = await api.get(`/api/requests/${id}/`);
    return res.data;
  } catch (error) {
    handleError(error, 'getRequestById');
  }
};

// Update a request
export const updateRequest = async (id, requestData) => {
  try {
    const res = await api.put(`/api/requests/${id}/`, requestData);
    return res.data;
  } catch (error) {
    handleError(error, 'updateRequest');
  }
};

// Delete a request
export const deleteRequest = async (id) => {
  try {
    const res = await api.delete(`/api/requests/${id}/`);
    return res.data;
  } catch (error) {
    handleError(error, 'deleteRequest');
  }
};

// ─── Stock API ────────────────────────────────────────────

// Validate stock availability
export const validateStock = async (materials) => {
  try {
    const res = await api.post('/api/validate-stock/', { materials });
    return res.data;
  } catch (error) {
    handleError(error, 'validateStock');
  }
};

// ─── Auth API ─────────────────────────────────────────────

// Login
export const login = async (email, password) => {
  try {
    const res = await api.post('/api/auth/login/', { email, password });
    return res.data;
  } catch (error) {
    handleError(error, 'login');
  }
};

// Logout
export const logout = async () => {
  try {
    const res = await api.post('/api/auth/logout/');
    return res.data;
  } catch (error) {
    handleError(error, 'logout');
  }
};

export default api;