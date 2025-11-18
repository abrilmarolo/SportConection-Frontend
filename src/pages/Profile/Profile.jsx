import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { profilePhotoService } from '../../services/profilePhotoService';
import { FaEnvelope, FaPhone, FaInstagram, FaTwitter } from 'react-icons/fa';

export function Profile() {
  const { isAuthenticated, user, getMyProfile, loading, authError, deleteProfile } = useAuth();
  const { isAdmin } = useAdmin();
  const [profileData, setProfileData] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoDeleting, setPhotoDeleting] = useState(false);
  const [profileDeleting, setProfileDeleting] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      fetchProfile();
    }
  }, [isAuthenticated, isAdmin]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setPhotoError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setPhotoUploading(true);
      setPhotoError(null);
      
      const response = await profilePhotoService.uploadPhoto(file);
      
      // Actualizar los datos del perfil para mostrar la nueva foto
      await fetchProfile();
      
      // Notificar a otros componentes que la foto se actualizó
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated'));
      
      console.log('Foto subida exitosamente:', response);
    } catch (error) {
      setPhotoError(error.message);
      console.error('Error uploading photo:', error);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
      return;
    }

    try {
      setPhotoDeleting(true);
      setPhotoError(null);
      
      await profilePhotoService.deletePhoto();
      
      // Actualizar los datos del perfil
      await fetchProfile();
      
      // Notificar a otros componentes que la foto se actualizó
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated'));
      
      console.log('Foto eliminada exitosamente');
    } catch (error) {
      setPhotoError(error.message);
      console.error('Error deleting photo:', error);
    } finally {
      setPhotoDeleting(false);
    }
  };

  const handleDeleteProfile = async () => {
    // Confirmación para una acción tan crítica
    const confirm = window.confirm(
      'ADVERTENCIA: Esta acción eliminará permanentemente tu perfil y toda tu información.\n\n¿Estás completamente seguro de que quieres continuar?'
    );
    
    if (!confirm) return;

    try {
      setProfileDeleting(true);
      setPhotoError(null);
      
      // Usar la función deleteProfile del contexto que maneja la redirección correctamente
      await deleteProfile();
      
    } catch (error) {
      setPhotoError(`Error al eliminar el perfil: ${error.message}`);
      console.error('Error deleting profile:', error);
    } finally {
      setProfileDeleting(false);
    }
  };

  const fetchProfile = async () => {
    if (!isAuthenticated || isAdmin) return;
    
    try {
      const data = await getMyProfile();
      console.log('Profile data loaded:', data);
      console.log('User data from auth:', user);
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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

  // Vista para Admin
  if (isAdmin) {
    return (
      <section className="m-4">
        <div className="w-[90%] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {authError && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
              {authError}
            </div>
          )}

          <div className="space-y-8">
            {/* Sección de Avatar de Admin */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-orange-200 dark:border-orange-800">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Admin */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Administrador
              </h1>

              <div className="text-lg text-gray-600 dark:text-gray-400">
                <span className="capitalize font-medium">
                  Administrador del Sistema
                </span>
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Se unió en {new Date().getFullYear()}
              </p>

              {/* Contacto de Admin */}
              <div className="flex justify-center items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-500" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Vista para Usuario
  return (
    <section className="m-4">
      <div className="w-[90%] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {authError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {authError}
          </div>
        )}

        <div className="space-y-8">
          {/* Sección de Foto de Perfil de Usuario */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-orange-200">
                {profileData?.profile?.photo_url ? (
                  <img 
                    src={profileData.profile.photo_url} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {profileData?.profile?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Loading overlay */}
              {(photoUploading || photoDeleting) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Botones de acción para foto */}
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {photoUploading ? 'Subiendo...' : (profileData?.profile?.photo_url ? 'Cambiar foto' : 'Subir foto')}
              </button>
              
              {profileData?.profile?.photo_url && (
                <button
                  onClick={handlePhotoDelete}
                  disabled={photoDeleting || photoUploading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {photoDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              )}
            </div>

            {/* Input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Error de foto */}
            {photoError && (
              <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 rounded-lg text-sm max-w-md text-center">
                {photoError}
                <button 
                  onClick={() => setPhotoError(null)}
                  className="ml-2 font-bold hover:text-red-900 dark:hover:text-red-200"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Información Principal del Usuario */}
          <div className="text-center space-y-4">
            {/* Nombre completo */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {profileData?.profileType === 'team' 
                ? profileData?.profile?.name 
                : `${profileData?.profile?.name || ''} ${profileData?.profile?.last_name || ''}`.trim() || 'Usuario'}
            </h1>

            {/* Tipo de perfil y deporte */}
            <div className="text-lg text-gray-600 dark:text-gray-400">
              <span className="capitalize font-medium">
                {profileData?.profileType === 'athlete' ? 'Atleta' : 
                 profileData?.profileType === 'agent' ? 'Representante' : 
                 profileData?.profileType === 'team' ? 'Equipo' : 'Usuario'}
              </span>
              {profileData?.profile?.sport?.name && (
                <>
                  <span className="mx-2">-</span>
                  <span>{profileData?.profile?.sport?.name}</span>
                </>
              )}
            </div>

            {/* Fecha de unión */}
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Se unió en {new Date().getFullYear()}
            </p>

            {/* Descripción */}
            {profileData?.profile?.description && (
              <div className="max-w-2xl mx-auto">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {profileData?.profile?.description}
                </p>
              </div>
            )}

            {/* Contacto */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                <span>{user?.email}</span>
              </div>
              {profileData?.profile?.phone_number && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-500" />
                  <span>{profileData?.profile?.phone_number}</span>
                </div>
              )}
            </div>

            {/* Redes sociales */}
            {profileData && (profileData?.profile?.ig_user || profileData?.profile?.x_user) && (
              <div className="flex justify-center gap-6 pt-4">
                {profileData?.profile?.ig_user && (
                  <a 
                    href={`https://instagram.com/${profileData?.profile?.ig_user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <FaInstagram />
                    <span>@{profileData?.profile?.ig_user}</span>
                  </a>
                )}
                {profileData?.profile?.x_user && (
                  <a 
                    href={`https://twitter.com/${profileData?.profile?.x_user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaTwitter />
                    <span>@{profileData?.profile?.x_user}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sección "Acerca de" del Usuario */}
          {profileData && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Acerca de</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Información física (solo para atletas) */}
                {profileData.profileType === 'athlete' && (
                  <>
                    {(profileData.profile?.weight || profileData.profile?.height) && (
                      <div className="space-y-3">
                        {profileData.profile?.weight && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Peso</span>
                            <span className="font-medium text-gray-900 dark:text-white">{profileData.profile.weight} kg</span>
                          </div>
                        )}
                        {profileData.profile?.height && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Altura</span>
                            <span className="font-medium text-gray-900 dark:text-white">{profileData.profile.height} cm</span>
                          </div>
                        )}
                        {profileData.profile?.birthdate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Fecha de nacimiento</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {new Date(profileData.profile.birthdate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Información adicional según tipo */}
                <div className="space-y-3">
                  {profileData.profileType === 'agent' && profileData.profile?.agency && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Agencia</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profileData.profile.agency}</span>
                    </div>
                  )}
                  
                  {profileData.profileType === 'team' && profileData.profile?.job && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Representante</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profileData.profile.job}</span>
                    </div>
                  )}

                  {/* Ubicación */}
                  {profileData.profile?.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ubicación</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {[
                          profileData.profile.location.city,
                          profileData.profile.location.province,
                          profileData.profile.location.country
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción del Usuario */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors">
              Editar Perfil
            </button>
            <button 
              onClick={handleDeleteProfile}
              disabled={profileDeleting || photoUploading || photoDeleting}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profileDeleting ? 'Eliminando cuenta...' : 'Borrar Cuenta'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );  
}
