import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';

export function CreateLocation() {
  const navigate = useNavigate();
  const { createLocation, loading, error, isAdmin } = useAdmin();
  const [locationData, setLocationData] = useState({
    country: '',
    province: '',
    city: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!locationData.country.trim() || !locationData.city.trim()) {
      return;
    }

    try {
      await createLocation(locationData);
      navigate('/Ubicacion');
    } catch (err) {
      console.error('Error al crear ubicación:', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-600 dark:bg-red-900 rounded-lg">
          <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
          <p className="mt-2 text-white">No tienes permisos para crear ubicaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 m-4">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Crear Nueva Ubicación
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="country" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                País
              </label>
              <input
                type="text"
                id="country"
                required
                value={locationData.country}
                onChange={(e) => setLocationData({ ...locationData, country: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label 
                htmlFor="province" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Provincia
              </label>
              <input
                type="text"
                id="province"
                value={locationData.province}
                onChange={(e) => setLocationData({ ...locationData, province: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label 
                htmlFor="city" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                required
                value={locationData.city}
                onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/Ubicacion')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear Ubicación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
