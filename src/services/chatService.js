import api from './api';

export const chatService = {
  // Obtener todos los matches del usuario autenticado
  getMatches: async () => {
    try {
      const res = await api.get('/swipe/matches');
      return res.data;
    } catch (err) {
      console.error('Error al obtener matches:', err);
      throw err;
    }
  },

  // Obtener perfil completo de un usuario
  getUserProfile: async (userId) => {
    try {
      const res = await api.get(`/profile/${userId}`);
      return res.data.profile;
    } catch (err) {
      console.error('Error al obtener perfil del usuario:', err);
      throw err;
    }
  },
};
