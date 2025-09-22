import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';

export function Sport() {
  const navigate = useNavigate();
  const { adminData, loading, error, getAllSports, updateSport, deleteSport, isAdmin } = useAdmin();
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchSports = async () => {
      try {
        await getAllSports();
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };

    if (isAdmin) {
      fetchSports();
    }
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este deporte?')) {
      try {
        await deleteSport(id);
        await getAllSports();
      } catch (err) {
        console.error('Error al eliminar deporte:', err);
      }
    }
  };

  const startEdit = (sport) => {
    setEditId(sport.id);
    setEditData({
      name: sport.name || '',
      description: sport.description || '',
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ name: '', description: '' });
  };

  const handleEdit = async () => {
    if (!editData.name.trim()) return;
    
    try {
      await updateSport(editId, editData);
      await getAllSports();
      cancelEdit();
    } catch (err) {
      console.error('Error al modificar deporte:', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-600 dark:bg-red-900 rounded-lg">
          <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
          <p className="mt-2 text-white">No tienes permisos para gestionar deportes</p>
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
              Gestión de Deportes
            </h2>
            <button
              className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate('/CrearDeporte')}
            >
              Crear nuevo deporte
            </button>
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
                      Nombre
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {adminData.sports.map((sport) => (
                    <tr key={sport.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {editId === sport.id ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          sport.name
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editId === sport.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleEdit}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(sport)}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(sport.id)}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
