import api from './api';

export const matchService = {
  // Obtener usuarios para descubrir (swipe)
  getDiscover: async (params = {}) => {
    try {
      const res = await api.get('/swipe/discover', { params });
      return res.data;
    } catch (err) {
      console.error('Error al obtener usuarios para descubrir:', err);
      throw err;
    }
  },

  // Enviar swipe (like/dislike)
  sendSwipe: async (swipedUserId, action) => {
    try {
      const res = await api.post('/swipe', {
        swiped_user_id: swipedUserId,
        action
      });
      return res.data;
    } catch (err) {
      console.error('Error al enviar swipe:', err);
      throw err;
    }
  },
};
