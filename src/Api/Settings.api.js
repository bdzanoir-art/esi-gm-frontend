import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/esi-gm';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Categories ---
export const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createCategory = async (data) => {
  const response = await axios.post(`${BASE_URL}/categories/`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${BASE_URL}/categories/${id}/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// --- System Settings ---
export const getSystemSettings = async () => {
  const response = await axios.get(`${BASE_URL}/settings/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateSystemSettings = async (data) => {
  const response = await axios.patch(`${BASE_URL}/settings/`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getPlatformInfo = async () => {
  const response = await axios.get(`${BASE_URL}/platform-info/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
