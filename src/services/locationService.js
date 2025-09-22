import api from './api';

export const locationService = {
  getAllLocations: async () => {
  try {
    const res = await api.get('/lookup/locations');
    return res.data;
  } catch (err) {
    console.error('Error al traer ubicaciones', err);
    return [];
  }
}
}
