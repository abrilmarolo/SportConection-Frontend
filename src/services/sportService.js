import api from './api';

export const sportService = {
  getAllSports: async () => {
    try {
      const res = await api.get('/lookup/sports');
      return res.data;
    } catch (err) {
      console.error('Error al traer deportes', err);
      return [];
    }
  },


};