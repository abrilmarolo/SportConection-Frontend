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

  // Obtener estadísticas de swipes (límite diario y estado premium)
  getSwipeStats: async () => {
    try {
      const res = await api.get('/swipe/stats');
      return res.data;
    } catch (err) {
      console.error('Error al obtener estadísticas de swipes:', err);
      throw err;
    }
  },

  // Obtener información de contacto directo (solo premium)
  getDirectContact: async (targetUserId) => {
    try {
      const res = await api.get(`/swipe/contact/${targetUserId}`);
      return res.data;
    } catch (err) {
      console.error('Error al obtener contacto directo:', err);
      throw err;
    }
  },
};
