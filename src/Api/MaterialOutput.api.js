import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/esi-gm';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMaterialOutputs = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/material-outputs/`, {
      headers: getAuthHeader(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching material outputs:', error);
    return [];
  }
};

export const getMaterialOutputStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/material-outputs/stats/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching material output stats:', error);
    return null;
  }
};
