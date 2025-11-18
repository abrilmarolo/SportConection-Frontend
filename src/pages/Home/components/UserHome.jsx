import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useAdmin } from '../../../context/AdminContext'

export function UserHome() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir según el rol del usuario
      if (isAdmin) {
        navigate('/Deportes');
      } else {
        navigate('/Match');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Mostrar un loading mientras se redirige
  return (
    <div className='min-h-screen m-4 flex items-center justify-center'>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className='text-xl font-medium text-gray-600 dark:text-gray-400'>
          Redirigiendo...
        </h1>
      </div>
    </div>
  );
}
