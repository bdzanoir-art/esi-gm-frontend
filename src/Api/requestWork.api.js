// src/Api/Requests.api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/requests';

export const getMaterialRequests = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};
