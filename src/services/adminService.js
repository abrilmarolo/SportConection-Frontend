import api from './api';

export const adminService = {
  getAllLocations: async () => {
    try {
      const response = await api.get('/admin/locations');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  createLocation: async (locationData) => {
    try {
      const res = await api.post('/admin/locations', locationData);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        'Error al crear ubicación';
      throw new Error(errorMessage);
    }
  },

  updateLocation: async (id, updates) => {
    try {
      const res = await api.put(`/admin/locations/${id}`, updates);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar ubicación';
      throw new Error(errorMessage);
    }
  },

  deleteLocation: async (id) => {
    try {
      const res = await api.delete(`/admin/locations/${id}`);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar ubicación';
      throw new Error(errorMessage);
    }
  },
  getAllSports: async () => {
    try {
      const response = await api.get('/admin/sports');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  getSportById: async (id) => {
    try {
      const response = await api.get(`/admin/sports/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  createSport: async (sportData) => {
    try {
      const response = await api.post('/admin/sports', sportData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  updateSport: async (id, updates) => {
    try {
      const response = await api.put(`/admin/sports/${id}`, updates);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  deleteSport: async (id) => {
    try {
      const response = await api.delete(`/admin/sports/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },
  createUser: async (userData) => {
    try {
      console.log('Creating user:', userData);
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (!error.response) {
        throw new Error('Error de conexión. Verifique su conexión a internet.');
      }

      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
     return response.data;
   } catch (error) {
     const errorMessage = error.response?.data?.message ||
       error.response?.data?.error ||
       'Error de conexión';
     throw new Error(errorMessage);
   }
 },
  updateUser: async (id, updates) => {
    try {
      const response = await api.put(`/admin/users/${id}`, updates);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  },
  changeUserRole: async (id, role) => {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error de conexión';
      throw new Error(errorMessage);
    }
  }
}
