import api from './api';

export const profilePhotoService = {
  uploadPhoto: async (photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await api.post('/profile-photo/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al subir la foto';
      throw new Error(errorMessage);
    }
  },

  deletePhoto: async () => {
    try {
      const response = await api.delete('/profile-photo/delete');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al eliminar la foto';
      throw new Error(errorMessage);
    }
  }
};