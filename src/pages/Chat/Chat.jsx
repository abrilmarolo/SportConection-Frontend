import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';

export function Chat() {
    const { isAuthenticated } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                setMatches(response.data.matches || []);
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
                                                    
                                                    {/* Botón principal de WhatsApp */}
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
        </>
    );
}
