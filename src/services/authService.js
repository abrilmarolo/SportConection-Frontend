import api from './api';

export const authService = {
register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      // Mejorar el manejo de errores
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Mejorar el manejo de errores
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Error de conexión';
      throw new Error(errorMessage);
    }
  }
};