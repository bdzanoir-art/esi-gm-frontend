import axios from 'axios';

const API_URL = 'http://localhost:8000/api/esi-gm/laboratories/';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getLaboratories = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching labs from Backend:', error);

    return [];
  }
};

export const createLaboratory = async (labData) => {
  try {
    const response = await axios.post(API_URL, labData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating lab:', error);
    throw error;
  }
};
export const updateLaboratory = async (labId, labData) => {
  try {
    const response = await axios.patch(`${API_URL}${labId}/`, labData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating lab:', error);
    throw error;
  }
};

export const deleteLaboratory = async (labId) => {
  try {
    await axios.delete(`${API_URL}${labId}/`, {
      headers: getAuthHeader(),
    });
    return true;
  } catch (error) {
    console.error('Error deleting lab:', error);
    throw error;
  }
};
