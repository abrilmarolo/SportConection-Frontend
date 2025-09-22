import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';

export function User() {
  const navigate = useNavigate();
  const { adminData, loading, error, getAllUsers, updateUser, deleteUser, isAdmin } = useAdmin();
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getAllUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(id);
        await getAllUsers();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  const startEdit = (user) => {
    setEditId(user.id);
    setEditData({
      email: user.email || '',
      password: '',
      role: user.role || 'user'
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ email: '', password: '', role: 'user' });
  };

  const handleEdit = async () => {
    if (!editData.email.trim()) return;
    
    try {
      const updateFields = {
        email: editData.email,
        ...(editData.password && { password: editData.password }),
        role: editData.role
      };

      await updateUser(editId, updateFields);
      await getAllUsers();
      cancelEdit();
    } catch (err) {
      console.error('Error al modificar usuario:', err);
    }
  };

    if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-600 dark:bg-red-900 rounded-lg">
          <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
          <p className="mt-2 text-white">Debes iniciar sesión para ver tu perfil</p>
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
              Gestión de Usuarios
            </h2>
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {adminData.users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {editId === user.id ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {editId === user.id ? (
                          <select
                            value={editData.role}
                            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                          </select>
                        ) : (
                          user.role
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editId === user.id ? (
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
                              onClick={() => startEdit(user)}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
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
