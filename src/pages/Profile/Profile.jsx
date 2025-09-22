import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

export function Profile() {
  const { isAuthenticated, user, getMyProfile, loading, authError } = useAuth();
  const { isAdmin } = useAdmin();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || isAdmin) return; // Don't fetch profile for admin users
      
      try {
        const data = await getMyProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-600 dark:bg-red-900 rounded-lg">
          <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
          <p className="mt-2 text-white">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="m-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {authError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {authError}
          </div>
        )}

        <div className="space-y-6">
          <div className="items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
              Mi Perfil
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h3>
              <p className="mt-1 text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tipo de Usuario
              </h3>
              <p className="mt-1 text-gray-900 dark:text-white capitalize">
                {user?.role || '-'}
              </p>
            </div>
          </div>

          {!isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(profileData?.profileType === 'agent') && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nombre
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Apellido
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.last_name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      País
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Provincia
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.province}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ciudad
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.city}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Deporte
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.sport?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Teléfono
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.phone_number || '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Descripción
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Agencia
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.agency || '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Usuario de Instagram
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.ig_user || '-'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Usuario de Twitter
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.x_user || '-'}
                    </p>
                  </div>
                  
                </>
              )}
              {(profileData?.profileType === 'team') && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nombre del Equipo
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Encargado de la Cuenta
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.job}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      País
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Provincia
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.province}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ciudad
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.city}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Deporte
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.sport?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Teléfono
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.phone_number || '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Descripción
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Usuario de Instagram
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.ig_user || '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Usuario de Twitter
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.x_user || '-'}
                    </p>
                  </div>
                </>
              )}
              {(profileData?.profileType === 'athlete') && (
                <>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nombre
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Apellido
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.last_name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nro de Telefono
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.phone_number || '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fecha de Nacimiento
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.birthdate}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Altura
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.height || '-'} cm
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Peso
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.weight || '-'} kg
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      País
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Provincia
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.province}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ciudad
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.location?.city}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Deporte
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.sport?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Usuario de Instagram
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.ig_user || '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Usuario de Twitter
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.x_user || '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Descripción
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profileData?.profile?.description|| '-'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
