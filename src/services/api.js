import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (userData) => {
  try {
    // On pointe sur la route d'authentification inscrite dans Django (ex: auth/register/)
    const response = await api.post('auth/register/', userData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.response?.data || error.message);
    throw error;
  }
};

export default api;