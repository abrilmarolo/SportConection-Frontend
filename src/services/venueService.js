 import api from './api';

export const venueService = {
  getAllVenues: async (sportId, lat, lng) => {
    try {
      const response = await api.get(`/venues?sport_id=${sportId}&lat=${lat}&lng=${lng}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener venues:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener venues');
    }
  },

  getSports: async () => {
    try {
      const response = await api.get('/lookup/sports');
      return response.data;
    } catch (error) {
      console.error('Error al obtener deportes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener deportes');
    }
  }
};
