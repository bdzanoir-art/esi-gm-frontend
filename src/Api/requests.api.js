import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/requests';

export const getMyRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/my-requests`);
    return response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};

export const submitNewRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to submit request';
  }
};

export const validateStock = async (items) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/validate`, { items });
    return response.data; // { valid: true/false, message: "..." }
  } catch (error) {
    console.error('Validation error:', error);
    return { valid: false, message: 'Server error during validation' };
  }
};
