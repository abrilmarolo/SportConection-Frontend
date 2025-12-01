import api from './api';

export const subscriptionService = {
  // Obtener planes públicamente (sin autenticación)
  getPublicPlans: async () => {
    try {
      const res = await api.get('/subscriptions/plans');
      return res.data;
    } catch (err) {
      console.error('Error al obtener planes:', err);
      throw err;
    }
  },

  // Crear sesión de checkout
  createCheckoutSession: async (planId) => {
    try {
      console.log('Creando checkout session con planId:', planId);
      const res = await api.post('/subscriptions/create-checkout-session', {
        plan_id: planId
      });
      console.log('Respuesta del checkout:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error al crear sesión de checkout:', err);
      console.error('Detalles del error:', err.response?.data);
      console.error('Status del error:', err.response?.status);
      console.error('Mensaje del backend:', err.response?.data?.message || err.response?.data?.error);
      throw err;
    }
  },

  // Verificar estado del pago
  verifyPaymentStatus: async () => {
    try {
      const res = await api.get('/subscriptions/verify-payment');
      return res.data;
    } catch (err) {
      console.error('Error al verificar estado del pago:', err);
      throw err;
    }
  },

  // Cancelar suscripción
  cancelSubscription: async () => {
    try {
      const res = await api.post('/subscriptions/cancel');
      return res.data;
    } catch (err) {
      console.error('Error al cancelar suscripción:', err);
      throw err;
    }
  },

  // Obtener estado de suscripción
  getSubscriptionStatus: async () => {
    try {
      const res = await api.get('/subscriptions/status');
      console.log('Estado de suscripción recibido:', res.data);
      return res.data;
    } catch (err) {
      // Silenciar completamente errores 404 y 500 (sin suscripción)
      const isExpectedError = err.response?.status === 404 || err.response?.status === 500;
      
      if (!isExpectedError) {
        console.error('Error al obtener estado de suscripción:', err);
      }
      
      // Para errores esperados, lanzamos un error silencioso
      if (isExpectedError) {
        const silentError = new Error('No subscription');
        silentError.response = { status: err.response?.status };
        silentError.isExpected = true;
        throw silentError;
      }
      
      throw err;
    }
  }
};
