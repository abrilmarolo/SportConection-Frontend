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

  completeProfile: async (profileData) => {
    try {
      const response = await api.post('/auth/complete-profile', profileData);
      return response.data;
    } catch (error) {
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
  },

  googleLogin: async (token) => {
    try {
      const response = await api.post('/auth/google', { token });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  getMyProfile: async () => {
    try {
      console.log('Fetching profile...');
      // Remove the /api prefix since it's not in your backend routes
      const response = await api.get('/profile/me');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 404) {
        throw new Error('Ruta no encontrada. Verifique la configuración del backend.');
      }
      
      throw new Error(error.response?.data?.message || 'Error al cargar el perfil');
    }
  },

  deleteMyProfile: async () => {
    try {
      const response = await api.delete('/profile/me');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  updateProfile: async (updates) => {
    try {
      const response = await api.put('/profile/me', updates);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  }
};