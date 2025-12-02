import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import { motion } from 'framer-motion';

export function CreatePlan() {
  const navigate = useNavigate();
  const { createPlan, loading, error, isAdmin } = useAdmin();
  const [planData, setPlanData] = useState({
    name: '',
    price: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!planData.name.trim() || !planData.price) {
      return;
    }

    try {
      await createPlan({
        name: planData.name,
        price: parseFloat(planData.price)
      });
      navigate('/Plan');
    } catch (err) {
      console.error('Error al crear plan:', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-600 dark:bg-red-900 rounded-lg">
          <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
          <p className="mt-2 text-white">No tienes permisos para crear planes</p>
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
              Crear Nuevo Plan
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
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nombre del Plan
              </label>
              <input
                type="text"
                id="name"
                required
                value={planData.name}
                onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
                placeholder="Ej: Plan Premium"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label 
                htmlFor="price" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Precio (USD)
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                step="0.01"
                value={planData.price}
                onChange={(e) => setPlanData({ ...planData, price: e.target.value })}
                placeholder="9.99"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <motion.button
                type="button"
                onClick={() => navigate('/Plan')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                {loading ? 'Creando...' : 'Crear Plan'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
