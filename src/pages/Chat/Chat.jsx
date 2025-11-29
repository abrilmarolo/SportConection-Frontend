import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FaPhone, FaWhatsapp, FaInstagram, FaTwitter, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaRuler, FaWeight, FaBriefcase } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

export function Chat() {
    const { isAuthenticated } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchMatches();
    }, [isAuthenticated]);

    async function fetchMatches() {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🤝 Fetching user matches for chat');
            
            const response = await api.get('/swipe/matches');
            
            console.log('✅ Matches response:', response.data);
            
            if (response.data.success) {
                const matchesData = response.data.matches || [];
                console.log('🔍 First match structure:', matchesData[0]);
                setMatches(matchesData);
            }
            
        } catch (err) {
            console.error('💥 Error in fetchMatches:', err);
            setError('Error al cargar los matches');
        } finally {
            setLoading(false);
        }
    }

    // Función para abrir WhatsApp
    function openWhatsApp(phoneNumber, userName) {
        if (!phoneNumber) {
            setError('El usuario no tiene número de teléfono disponible');
            setTimeout(() => setError(null), 3000);
            return;
        }

        // Limpiar y formatear el número de teléfono
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        
        // Mensaje personalizado
        const message = `¡Hola ${userName}! Nos conectamos a través de Sport Connection. Me gustaría hablar contigo sobre deportes.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        
        // Abrir en nueva ventana/pestaña
        window.open(whatsappUrl, '_blank');
    }

    // Función para obtener el perfil completo
    async function fetchUserProfile(userId) {
        try {
            setProfileLoading(true);
            console.log('🔍 Fetching profile for user:', userId);
            
            const response = await api.get(`/profile/${userId}`);
            console.log('✅ Profile response:', response.data);
            
            setProfileData(response.data);
            
        } catch (err) {
            console.error('💥 Error fetching profile:', err);
            setError('Error al cargar el perfil del usuario');
            setTimeout(() => setError(null), 3000);
        } finally {
            setProfileLoading(false);
        }
    }

    // Función para abrir el modal con perfil
    function openProfileModal(match) {
        console.log('🔍 Opening profile modal for match:', match);
        console.log('🔍 Other user data:', match.other_user);
        
        setSelectedProfile(match);
        
        // Intentar diferentes propiedades para obtener el user_id
        const userId = match.other_user.user_id || match.other_user.id || match.other_user_id;
        
        console.log('🔍 Using userId:', userId);
        
        if (!userId) {
            console.error('❌ No se pudo encontrar user_id en:', match.other_user);
            setError('No se pudo obtener el ID del usuario');
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        fetchUserProfile(userId);
    }

    // Función para cerrar el modal
    function closeProfileModal() {
        setSelectedProfile(null);
        setProfileData(null);
    }

    // Función para formatear número de teléfono como link
    function formatPhoneNumber(phone) {
        if (!phone) return null;
        
        // Limpiar el número
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Formatear para mostrar (ejemplo: +54 11 1234-5678)
        if (cleanPhone.length >= 10) {
            const countryCode = cleanPhone.substring(0, 2);
            const areaCode = cleanPhone.substring(2, 4);
            const firstPart = cleanPhone.substring(4, 8);
            const secondPart = cleanPhone.substring(8);
            
            return `+${countryCode} ${areaCode} ${firstPart}-${secondPart}`;
        }
        
        return phone;
    }

    // Función para calcular edad
    function calculateAge(birthdate) {
        if (!birthdate) return null;
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    return (
        <>
            {!isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-red-700 dark:bg-red-900 rounded-lg">
                        <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
                        <p className="mt-2 text-white">Debes iniciar sesión para ver los chats</p>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen p-4 dark:text-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-semibold">Mis Matches</h1>
                            <button 
                                onClick={fetchMatches}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2">Cargando matches...</span>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 rounded">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Matches Grid */}
                        {!loading && matches.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💔</div>
                                <h3 className="text-xl font-semibold mb-2">No tienes matches aún</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Ve a la sección Match para encontrar personas y hacer match
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {matches.map((match) => (
                                    <div key={match.match_id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                                        {/* Header con foto y nombre */}
                                        <div className="p-4 border-b dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                                                    {match.other_user.profile?.photo_url ? (
                                                        <img 
                                                            src={match.other_user.profile.photo_url} 
                                                            alt={match.other_user.profile?.name || 'Usuario'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        
                                                        <span className="text-2xl font-bold">
                                                            {match.other_user.profile?.name ? 
                                                                match.other_user.profile.name.charAt(0).toUpperCase() : '?'}
                                                        </span>
                                                        
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">
                                                        {match.other_user.profile?.name && match.other_user.profile?.last_name 
                                                            ? `${match.other_user.profile.name} ${match.other_user.profile.last_name}`
                                                            : match.other_user.profile?.name || 'Usuario'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                        {match.other_user.profile_type}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información del match */}
                                        <div className="p-4 space-y-3">
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                <span className="font-medium">Match creado:</span>
                                                <span className="ml-2">
                                                    {new Date(match.created_at).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Número de teléfono como link clickeable */}
                                            {match.other_user.profile?.phone_number ? (
                                                <div className="space-y-2">
                                                    <div className="text-sm">
                                                        <span className="font-medium text-gray-600 dark:text-gray-300">Teléfono:</span>
                                                        <div className="mt-1">
                                                            <button
                                                                onClick={() => openWhatsApp(
                                                                    match.other_user.profile.phone_number, 
                                                                    match.other_user.profile?.name && match.other_user.profile?.last_name 
                                                                        ? `${match.other_user.profile.name} ${match.other_user.profile.last_name}`
                                                                        : match.other_user.profile?.name || 'Usuario'
                                                                )}
                                                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-mono text-sm underline transition-colors"
                                                            >
                                                                <FaPhone className="text-green-500" />
                                                                {formatPhoneNumber(match.other_user.profile.phone_number)}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Botón para ver perfil completo */}
                                                    <button
                                                        onClick={() => openProfileModal(match)}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium mb-2"
                                                    >
                                                        👤 Ver Perfil Completo
                                                    </button>

                                                    {/* Botón de WhatsApp */}
                                                    <button
                                                        onClick={() => openWhatsApp(
                                                            match.other_user.profile.phone_number, 
                                                            match.other_user.profile?.name && match.other_user.profile?.last_name 
                                                                ? `${match.other_user.profile.name} ${match.other_user.profile.last_name}`
                                                                : match.other_user.profile?.name || 'Usuario'
                                                        )}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                                                    >
                                                        <FaWhatsapp />
                                                        Chatear en WhatsApp
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                    No hay número de teléfono disponible
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal del perfil */}
            <Modal isOpen={!!selectedProfile} onClose={closeProfileModal}>
                {selectedProfile && (
                    <div className="space-y-8">
                        {/* Header del modal */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil Completo</h2>
                            <button
                                onClick={closeProfileModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Contenido del modal */}
                        {profileLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : profileData ? (
                            <div className="space-y-8">
                                {/* Foto de perfil centrada */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-40 h-40 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                                        {profileData.profile?.photo_url ? (
                                            <img 
                                                src={profileData.profile.photo_url} 
                                                alt={profileData.profile?.name || 'Usuario'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                {profileData.profile?.name ? 
                                                    profileData.profile.name.charAt(0).toUpperCase() : '?'}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Nombre y tipo */}
                                    <div className="text-center">
                                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {profileData.profile?.name && profileData.profile?.last_name 
                                                ? `${profileData.profile.name} ${profileData.profile.last_name}`
                                                : profileData.profile?.name || 'Usuario'}
                                        </h3>
                                        <div className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                                            <span className="capitalize font-medium">
                                                {profileData.profile_type === 'athlete' ? 'Atleta' : 
                                                 profileData.profile_type === 'agent' ? 'Representante' : 
                                                 profileData.profile_type === 'team' ? 'Equipo' : 'Usuario'}
                                            </span>
                                            {profileData.profile?.sport?.name && (
                                                <>
                                                    <span className="mx-2">-</span>
                                                    <span>{profileData.profile.sport.name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Descripción */}
                                {profileData.profile?.description && (
                                    <div className="max-w-2xl mx-auto text-center">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {profileData.profile.description}
                                        </p>
                                    </div>
                                )}

                                {/* Redes sociales (en línea horizontal) */}
                                {(profileData.profile?.ig_user || profileData.profile?.x_user) && (
                                    <div className="flex justify-center gap-6 pt-2">
                                        {profileData.profile?.ig_user && (
                                            <a
                                                href={`https://instagram.com/${profileData.profile.ig_user}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                                            >
                                                <FaInstagram size={20} />
                                                <span>@{profileData.profile.ig_user}</span>
                                            </a>
                                        )}
                                        {profileData.profile?.x_user && (
                                            <a
                                                href={`https://twitter.com/${profileData.profile.x_user}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <FaTwitter size={20} />
                                                <span>@{profileData.profile.x_user}</span>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Sección "Acerca de" */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Acerca de</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Información física (para atletas) */}
                                        {profileData.profile_type === 'athlete' && (profileData.profile?.weight || profileData.profile?.height || profileData.profile?.birthdate) && (
                                            <div className="space-y-3">
                                                {profileData.profile?.birthdate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Edad</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {calculateAge(profileData.profile.birthdate)} años
                                                        </span>
                                                    </div>
                                                )}
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
                                            </div>
                                        )}

                                        {/* Información adicional según tipo */}
                                        <div className="space-y-3">
                                            {profileData.profile_type === 'agent' && profileData.profile?.agency && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Agencia</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">{profileData.profile.agency}</span>
                                                </div>
                                            )}
                                            
                                            {profileData.profile_type === 'team' && profileData.profile?.job && (
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

                                            {/* Teléfono */}
                                            {profileData.profile?.phone_number && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Teléfono</span>
                                                    <span className="font-medium text-gray-900 dark:text-white font-mono">
                                                        {formatPhoneNumber(profileData.profile.phone_number)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de WhatsApp */}
                                {profileData.profile?.phone_number && (
                                    <div className="flex justify-center pt-2">
                                        <button
                                            onClick={() => {
                                                openWhatsApp(
                                                    profileData.profile.phone_number, 
                                                    profileData.profile?.name && profileData.profile?.last_name 
                                                        ? `${profileData.profile.name} ${profileData.profile.last_name}`
                                                        : profileData.profile?.name || 'Usuario'
                                                );
                                                closeProfileModal();
                                            }}
                                            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors flex items-center gap-2"
                                        >
                                            <FaWhatsapp size={20} />
                                            Chatear en WhatsApp
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">No se pudo cargar el perfil</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}
