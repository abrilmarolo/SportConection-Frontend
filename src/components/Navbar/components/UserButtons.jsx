import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../../routes/routes';
import { useAuth } from '../../../context/AuthContext';
import { useAdmin } from '../../../context/AdminContext';
import { profileRoute } from '../../../routes/routes';
import api from '../../../services/api';

export function UserButtons({ user }) {
  const { logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileType, setProfileType] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Solo cargar la foto una vez al inicio
  useEffect(() => {
    const loadInitialPhoto = async () => {
      try {
        const response = await api.get('/profile/me');
        setProfilePhoto(response.data.profile?.photo_url);
        setProfileType(response.data.profileType);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error loading profile photo:', error);
      }
    };

    if (user && !isAdmin) {
      loadInitialPhoto();
    }
  }, [user?.id, isAdmin]); // Depende del ID del usuario y si es admin

  // Escuchar eventos personalizados para actualizar la foto
  useEffect(() => {
    const handleProfileUpdate = async () => {
      try {
        const response = await api.get('/profile/me');
        setProfilePhoto(response.data.profile?.photo_url);
        setProfileType(response.data.profileType);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error refreshing profile photo:', error);
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfileUpdate);
    };
  }, []);


  return (
    <div className="flex items-center space-x-4">
      <Link
        to={profileRoute.path}
        className="flex items-center space-x-2 group"
        title="Mi Perfil"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Mi perfil"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                console.log('Error loading profile image, showing fallback icon');
                setProfilePhoto(null); // Si falla, mostrar ícono
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {isAdmin ? 'A' : (profileData?.profile?.name?.[0]?.toUpperCase() || 'U')}
              </span>
            </div>
          )}
        </div>
      </Link>




      <button
        onClick={logout}
        className="px-2 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg hidden md:block cursor-pointer"
      >
        Cerrar Sesión
      </button>


    </div>
  );
}