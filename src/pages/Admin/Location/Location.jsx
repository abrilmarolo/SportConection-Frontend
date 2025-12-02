import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export function Location() {
  const navigate = useNavigate();
  const { adminData, loading, error, getAllLocations, updateLocation, deleteLocation, isAdmin } = useAdmin();
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    country: '',
    province: '',
    city: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        await getAllLocations();
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    if (isAdmin) {
      fetchLocations();
    }
  }, [isAdmin]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la ubicación permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteLocation(id);
        await getAllLocations();
        toast.success('¡Ubicación eliminada exitosamente!');
      } catch (err) {
        console.error('Error al eliminar ubicación:', err);
        toast.error('Error al eliminar la ubicación');
      }
    }
  };

  const startEdit = (location) => {
    setEditId(location.id);
    setEditData({
      country: location.country || '',
      province: location.province || '',
      city: location.city || ''
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ country: '', province: '', city: '' });
  };

  const handleEdit = async () => {
    if (!editData.country.trim() || !editData.city.trim()) return;
    
    try {
      await updateLocation(editId, editData);
      await getAllLocations();
      cancelEdit();
      toast.success('¡Ubicación actualizada exitosamente!');
    } catch (err) {
      console.error('Error al modificar ubicación:', err);
      toast.error('Error al actualizar la ubicación');
    }
  };

  // Filtrar ubicaciones por búsqueda
  const filteredLocations = adminData.locations.filter(location =>
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.province && location.province.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calcular paginación
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, endIndex);

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-600 dark:bg-red-900 rounded-lg">
          <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
          <p className="mt-2 text-white">No tienes permisos para gestionar ubicaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 m-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="sm:flex sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Ubicaciones
            </h2>
            <motion.button
              className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2  text-white rounded-lg bg-blue-700 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => navigate('/CrearUbicacion')}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              Crear nueva ubicación
            </motion.button>
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por ciudad, provincia o país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      País
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Provincia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentLocations.map((location) => (
                    <tr key={location.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {editId === location.id ? (
                          <input
                            type="text"
                            value={editData.country}
                            onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          location.country
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {editId === location.id ? (
                          <input
                            type="text"
                            value={editData.province}
                            onChange={(e) => setEditData({ ...editData, province: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          location.province
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {editId === location.id ? (
                          <input
                            type="text"
                            value={editData.city}
                            onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          location.city
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editId === location.id ? (
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={handleEdit}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              Guardar
                            </motion.button>
                            <motion.button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              Cancelar
                            </motion.button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => startEdit(location)}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              Editar
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(location.id)}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              Eliminar
                            </motion.button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredLocations.length)} de {filteredLocations.length} ubicaciones
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      Anterior
                    </motion.button>
                    <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                      Página {currentPage} de {totalPages}
                    </span>
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      Siguiente
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
