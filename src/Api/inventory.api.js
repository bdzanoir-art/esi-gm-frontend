import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/esi-gm';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getItems = async (search = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/materials/`, { headers: getAuthHeader(),params : search ? { search } : {},});
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getCategories = () =>
  axios.get(`${BASE_URL}/categories/`, { headers: getAuthHeader() }).then((res) => res.data);
