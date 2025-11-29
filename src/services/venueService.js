import api from './api';

export const venueService = {
  getAllVenues: async () => {
    try {
      const response = await api.get('/venues');
      return response.data;
    } catch (error) {
      console.error('Error al obtener venues:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener venues');
    }
  },

  getVenueById: async (id) => {
    try {
      const response = await api.get(`/venues/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles del venue:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener detalles del venue');
    }
  }
};