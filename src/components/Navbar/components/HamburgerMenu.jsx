import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { routes } from '../../../routes/routes';
import { useAuth } from '../../../context/AuthContext';
import { useAdmin } from '../../../context/AdminContext';
import { profileRoute } from '../../../routes/routes';
import api from '../../../services/api';
import { FaBolt } from 'react-icons/fa';

export function HamburgerMenu({ isOpen, setIsOpen }) {
  const registerRoute = routes.find(route => route.path === '/Registro');
  const { logout, isAuthenticated, user } = useAuth();
  const { isAdmin } = useAdmin();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileType, setProfileType] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Cargar foto de perfil
  useEffect(() => {
    const loadProfilePhoto = async () => {
      try {
        const response = await api.get('/profile/me');
        setProfilePhoto(response.data.profile?.photo_url);
        setProfileType(response.data.profileType);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error loading profile photo in hamburger menu:', error);
      }
    };

    if (isAuthenticated && user && !isAdmin) {
      loadProfilePhoto();
    }
  }, [isAuthenticated, user, isAdmin]);

  // Escuchar eventos de actualización de foto
  useEffect(() => {
    const handleProfileUpdate = async () => {
      try {
        const response = await api.get('/profile/me');
        setProfilePhoto(response.data.profile?.photo_url);
        setProfileType(response.data.profileType);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error refreshing profile photo in hamburger menu:', error);
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfileUpdate);
    };
  }, []);

  // Determinar el ícono por defecto según el tipo de perfil

  return (
    <div className='md:hidden flex items-center'>
      {isAuthenticated ? (
        <div className="flex items-center space-x-3">
          {!isAdmin && (
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Link
                to="/Suscripcion"
                className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Suscripción Premium"
              >
                <FaBolt className="text-2xl" />
              </Link>
            </motion.div>
          )}
          
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <Link
              to={profileRoute.path}
              className="flex items-center space-x-2"
              title="Mi Perfil"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Mi perfil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Error loading profile image in hamburger menu, showing fallback icon');
                      setProfilePhoto(null);
                    }}
                  />
                ) : (
                  
                    <span className="text-lg font-bold">
                      {isAdmin ? 'A' : (profileData?.profile?.name?.[0]?.toUpperCase() || 'U')}
                    </span>
                  
                )}
              </div>
            </Link>
          </motion.div>
          <motion.button
            onClick={logout}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700  dark:bg-red-800 dark:hover:bg-red-900 rounded-lg mr-2 cursor-pointer "
          >
            Cerrar Sesión
          </motion.button>
        </div>



      ) : (
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <Link
            to="/Registro"
            className='px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg mr-2 block'>
            {registerRoute.name}
          </Link>
        </motion.div>
      )}

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className='text-gray-700 dark:text-white focus:outline-none'
        whileTap={{ scale: 0.9, rotate: 90 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isOpen ? (
            <svg className="h-6 w-6 cur cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}