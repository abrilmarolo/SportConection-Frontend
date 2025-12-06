import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../context/PremiumContext';
import { matchService } from '../../services/matchService';
import { FaInstagram, FaTwitter, FaTimes, FaStar, FaBolt, FaCheck, FaPhone, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import { PaywallModal } from './components/PaywallModal';
import { ContactModal } from './components/ContactModal';

export function Match() {
    const { isAuthenticated } = useAuth();
    const { isPremium, swipesRemaining, decrementSwipes, refreshPremiumStatus } = usePremium();

    // Estados para swipe-cards
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [matchNotice, setMatchNotice] = useState(null);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedUserName, setMatchedUserName] = useState('');
    
    // Estados para filtros
    const [profileTypeFilter, setProfileTypeFilter] = useState('');
    const [userProfileType, setUserProfileType] = useState(null);
    const [availableTypes, setAvailableTypes] = useState([]);
    
    // Estados para modales premium
    const [showPaywallModal, setShowPaywallModal] = useState(false);
    const [paywallFeature, setPaywallFeature] = useState('unlimited_swipes');
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactInfo, setContactInfo] = useState(null);
    
    const topCardRef = useRef(null);
    const pointerData = useRef({ dragging: false, startX: 0, currentX: 0 });

    const fetchDiscover = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = { limit: 10 };
            if (profileTypeFilter) {
                params.profile_type_filter = profileTypeFilter;
            }
            
            const data = await matchService.getDiscover(params);
            
            if (!data.success) {
                throw new Error(data.error || 'Error desconocido del servidor');
            }
            
            setCards(data.users || []);
            setUserProfileType(data.user_profile_type);
            
            // Determinar tipos disponibles según el tipo de perfil del usuario
            // Según la API: Athletes ven teams y agents, Teams/Agents ven athletes
            if (data.user_profile_type === 'athlete') {
                setAvailableTypes(['team', 'agent']);
            } else {
                setAvailableTypes(['athlete']);
            }
            
        } catch (err) {
            // Manejar error de filtros premium
            if (err.response?.status === 403 && err.response?.data?.requires_subscription) {
                setPaywallFeature('profile_filters');
                setShowPaywallModal(true);
                setProfileTypeFilter(''); // Resetear filtro
                return;
            }
            
            let errorMessage = 'Error de conexión';
            
            if (err.response?.status === 404) {
                errorMessage = 'No se encontraron usuarios disponibles';
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message.includes('timeout')) {
                errorMessage = 'Tiempo de espera agotado. Verifica tu conexión.';
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = 'Tiempo de espera agotado. Verifica tu conexión.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [profileTypeFilter]);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchDiscover();
    }, [isAuthenticated, fetchDiscover]);

    function getProfileUserId(profile) {
        if (!profile) return null;
        if (profile.user_id) return profile.user_id;
        if (profile.user && profile.user.id) return profile.user.id;
        return null;
    }

    // Función para mostrar modal de confirmación de match
    function displayMatchModal(userName = 'tu nuevo match') {
        setMatchedUserName(userName);
        setShowMatchModal(true);
    }

    async function sendSwipe(swipedUserId, action, userName) {
        try {
            const data = await matchService.sendSwipe(swipedUserId, action);
            
            // Según la API, la respuesta es: { success: true, match: true/false, message: "..." }
            if (!data.success) {
                throw new Error(data.error || 'Error en el swipe');
            }
            
            // Actualizar contador de swipes
            if (!isPremium) {
                decrementSwipes();
            }
            
            // Si hay match, mostrar notificación y modal
            if (data.match) {
                setMatchNotice(`¡Match creado!  ${data.message || ''}`);
                setTimeout(() => setMatchNotice(null), 4000);
                
                // Mostrar modal de match con el nombre del usuario
                setTimeout(() => {
                    displayMatchModal(userName);
                }, 1000);
            }
            
            return data;
        } catch (err) {
            // Manejar límite de swipes alcanzado
            if (err.response?.status === 403 && err.response?.data?.requires_subscription) {
                setPaywallFeature('unlimited_swipes');
                setShowPaywallModal(true);
                refreshPremiumStatus(); // Actualizar estado
                throw err;
            }
            
            let errorMessage = 'Error al enviar swipe';
            
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.status === 400) {
                errorMessage = 'Solicitud inválida. Verifica los datos.';
            } else if (err.response?.status === 500) {
                errorMessage = 'Error del servidor. Intenta nuevamente.';
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = 'Tiempo de espera agotado. Verifica tu conexión.';
            }
            
            setError(errorMessage);
            throw err;
        }
    }

    async function handleAction(action) {
        if (cards.length === 0) return;
        
        try {
            const top = cards[0];
            const id = getProfileUserId(top);
            
            if (!id) {
                throw new Error('No se pudo obtener el ID del usuario');
            }
            
            // Obtener el nombre del usuario para el modal
            const userName = getDisplayName(top);
            
            await sendSwipe(id, action, userName);
            setCards(prev => prev.slice(1));
            
            // Auto-reload if few cards left
            if (cards.length <= 3) {
                setTimeout(() => fetchDiscover(), 500);
            }
        } catch (err) {
            console.error('Error in handleAction:', err);
        }
    }

    function onPointerDown(e) {
        if (!topCardRef.current) return;
        pointerData.current.dragging = true;
        pointerData.current.startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
        pointerData.current.currentX = 0;
        topCardRef.current.style.transition = 'none';
    }

    function onPointerMove(e) {
        if (!pointerData.current.dragging || !topCardRef.current) return;
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? pointerData.current.startX;
        const dx = clientX - pointerData.current.startX;
        pointerData.current.currentX = dx;
        const rotate = dx / 20;
        topCardRef.current.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
        
        // Indicador visual de acción
        const opacity = Math.min(Math.abs(dx) / 120, 1);
        const color = dx > 0 ? 'rgba(34, 197, 94, ' : 'rgba(239, 68, 68, ';
        topCardRef.current.style.boxShadow = `0 0 20px ${color}${opacity})`;
    }

    async function onPointerUp() {
        if (!pointerData.current.dragging || !topCardRef.current) return;
        pointerData.current.dragging = false;
        const dx = pointerData.current.currentX;
        const threshold = 120;
        const el = topCardRef.current;
        
        el.style.transition = 'transform 300ms ease';
        el.style.boxShadow = '';
        
        if (Math.abs(dx) > threshold) {
            const toX = dx > 0 ? window.innerWidth : -window.innerWidth;
            const rotate = dx > 0 ? 30 : -30;
            el.style.transform = `translateX(${toX}px) rotate(${rotate}deg)`;
            
            setTimeout(async () => {
                try {
                    const top = cards[0];
                    const id = getProfileUserId(top);
                    if (id) {
                        const action = dx > 0 ? 'like' : 'dislike';
                        const userName = getDisplayName(top);
                        await sendSwipe(id, action, userName);
                        setCards(prev => prev.slice(1));
                        
                        // Auto-reload si quedan pocos
                        if (cards.length <= 3) {
                            setTimeout(() => fetchDiscover(), 500);
                        }
                    }
                } catch (err) {
                    console.error('Error en swipe automático:', err);
                }
            }, 250);
        } else {
            el.style.transform = 'translateX(0px) rotate(0deg)';
        }
    }

    // Función para mostrar el nombre completo según el tipo de perfil
    function getDisplayName(card) {
        if (card.profile_type === 'team') {
            return card.name || 'Team';
        } else if (card.profile_type === 'athlete' || card.profile_type === 'agent') {
            return `${card.name || ''} ${card.last_name || ''}`.trim() || 'Usuario';
        }
        return 'Usuario';
    }

    // Función para obtener información adicional completa
    function getAdditionalInfo(card) {
        const sportName = card.sport?.name || '';
        const location = card.location ? 
            [card.location.city, card.location.province, card.location.country]
            .filter(Boolean).join(', ') : '';
        
        // Información específica por tipo de perfil
        let specificInfo = {};
        
        if (card.profile_type === 'athlete') {
            specificInfo = {
                age: card.birthdate ? new Date().getFullYear() - new Date(card.birthdate).getFullYear() : null,
                height: card.height ? `${card.height} cm` : null,
                weight: card.weight ? `${card.weight} kg` : null,
                social: {
                    instagram: card.ig_user,
                    twitter: card.x_user
                }
            };
        } else if (card.profile_type === 'agent') {
            specificInfo = {
                agency: card.agency,
                social: {
                    instagram: card.ig_user,
                    twitter: card.x_user
                }
            };
        } else if (card.profile_type === 'team') {
            specificInfo = {
                job: card.job,
                social: {
                    instagram: card.ig_user,
                    twitter: card.x_user
                }
            };
        }
        
        return { sportName, location, ...specificInfo };
    }

    // Renderizar filtros solo para athletes
    function renderFilters() {
        if (userProfileType !== 'athlete' || availableTypes.length === 0) return null;

        const handleFilterClick = (filter) => {
            // Si no es premium y intenta usar filtros específicos
            if (!isPremium && filter !== '') {
                setPaywallFeature('profile_filters');
                setShowPaywallModal(true);
                return;
            }
            setProfileTypeFilter(filter);
        };

        return (
            <div className="mb-4 flex gap-2 flex-wrap justify-center">
                <button
                    onClick={() => handleFilterClick('')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        profileTypeFilter === '' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }`}
                >
                    Todos
                </button>
                {availableTypes.includes('team') && (
                    <button
                        onClick={() => handleFilterClick('team')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                            profileTypeFilter === 'team' 
                                ? 'bg-blue-600 text-white' 
                                : !isPremium
                                ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-500 cursor-pointer'
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        Teams {!isPremium && <FaLock className="text-xs" />}
                    </button>
                )}
                {availableTypes.includes('agent') && (
                    <button
                        onClick={() => handleFilterClick('agent')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                            profileTypeFilter === 'agent' 
                                ? 'bg-blue-600 text-white' 
                                : !isPremium
                                ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-500 cursor-pointer'
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        Agents {!isPremium && <FaLock className="text-xs" />}
                    </button>
                )}
            </div>
        );
    }

    // Función para manejar contacto directo
    async function handleDirectContact(userId) {
        if (!isPremium) {
            setPaywallFeature('direct_contact');
            setShowPaywallModal(true);
            return;
        }

        try {
            const data = await matchService.getDirectContact(userId);
            setContactInfo(data);
            setShowContactModal(true);
        } catch (err) {
            console.error('Error getting direct contact:', err);
            
            if (err.response?.status === 403 && err.response?.data?.requires_subscription) {
                setPaywallFeature('direct_contact');
                setShowPaywallModal(true);
                return;
            }
            
            setError(err.response?.data?.error || 'Error al obtener información de contacto');
        }
    }

    return (
        <>
            {!isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-red-700 dark:bg-red-900 rounded-lg">
                        <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
                        <p className="mt-2 text-white">Debes iniciar sesión para ver los matches</p>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen p-4 dark:text-white flex flex-col items-center">
                    <div className="flex items-center justify-center w-full max-w-md mb-2">
                        <h1 className="text-2xl font-semibold">Match</h1>
                    </div>

                    {/* Contador de swipes */}
                    {!isPremium && swipesRemaining !== null && (
                        <div className="mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center gap-2">
                            <FaBolt className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm text-blue-800 dark:text-blue-200">
                                {swipesRemaining} swipes restantes hoy
                            </span>
                        </div>
                    )}

                    {isPremium && (
                        <div className="mb-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center gap-2 shadow-lg">
                            <FaBolt className="text-white" />
                            <span className="text-sm text-white font-semibold flex items-center gap-1">
                                Premium - Swipes ilimitados 
                            </span>
                        </div>
                    )}

                    

                    {/* Filtros */}
                    {renderFilters()}

                    {/* Loading state */}
                    {loading && (
                        <div className="mb-4 flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Cargando usuarios...</span>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 rounded max-w-md">
                            <div className="flex items-start gap-2">
                                <FaExclamationTriangle className="text-red-500 text-lg mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold">Error:</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button 
                                    onClick={() => setError(null)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                >
                                    Cerrar
                                </button>
                                <button 
                                    onClick={fetchDiscover}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? 'Cargando...' : 'Reintentar'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Match notice */}
                    {matchNotice && (
                        <div className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2">
                            <FaStar className="text-yellow-300" />
                            <span>{matchNotice}</span>
                        </div>
                    )}

                    {/* Cards container */}
                    <div className="relative w-full max-w-md h-[68vh]">
                        {cards.length === 0 && !loading && !error && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="mb-2 text-gray-600 dark:text-gray-400">No hay más usuarios disponibles</p>
                                    <button 
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" 
                                        onClick={fetchDiscover}
                                    >
                                        Recargar
                                    </button>
                                </div>
                            </div>
                        )}

                        {cards.map((card, idx) => {
                            const isTop = idx === 0;
                            const style = {
                                position: 'absolute',
                                inset: 0,
                                willChange: 'transform',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                padding: '16px',
                                transition: 'transform 300ms ease',
                                transform: 'translateY(' + (idx * 6) + 'px) scale(' + (1 - idx * 0.03) + ')',
                                zIndex: cards.length - idx
                            };
                            
                            const fullName = getDisplayName(card);
                            const additionalInfo = getAdditionalInfo(card);

                            return (
                                <div
                                    key={idx + '_' + (card.user_id || card.user?.id || idx)}
                                    ref={isTop ? topCardRef : null}
                                    style={style}
                                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden touch-none"
                                    onPointerDown={isTop ? onPointerDown : undefined}
                                    onPointerMove={isTop ? onPointerMove : undefined}
                                    onPointerUp={isTop ? onPointerUp : undefined}
                                    onPointerCancel={isTop ? onPointerUp : undefined}
                                >
                                    <div className="w-full h-full flex flex-col">
                                        {/* Imagen - altura fija más pequeña */}
                                        <div className="h-64 bg-gray-200 dark:bg-slate-700 flex items-center justify-center relative flex-shrink-0">
                                            {card.avatar_url || card.photo_url ? (
                                                <img 
                                                    src={card.avatar_url || card.photo_url} 
                                                    alt={fullName} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                               
                                                    <span className="text-6xl font-bold">
                                                        {card.name?.[0]?.toUpperCase() || 'U'}
                                                    </span>
                                                
                                            )}
                                            
                                            {/* Badge del tipo de perfil */}
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full capitalize">
                                                {card.profile_type}
                                            </div>
                                        </div>

                                        {/* Información - con scroll si es necesario */}
                                        <div className="flex-1 p-4 bg-white dark:bg-slate-800 overflow-y-auto">
                                            <div className="space-y-2">
                                                <div className="text-lg font-semibold">{fullName}</div>
                                                
                                                <div className="text-sm text-slate-500 dark:text-slate-300">
                                                    {additionalInfo.sportName}
                                                    {additionalInfo.location && ` • ${additionalInfo.location}`}
                                                </div>

                                                {/* Información específica por tipo */}
                                                {card.profile_type === 'athlete' && (
                                                    <div className="text-xs text-slate-400 space-y-1">
                                                        {additionalInfo.age && <div>Edad: {additionalInfo.age} años</div>}
                                                        {(additionalInfo.height || additionalInfo.weight) && (
                                                            <div>
                                                                {additionalInfo.height && `${additionalInfo.height}`}
                                                                {additionalInfo.height && additionalInfo.weight && ' • '}
                                                                {additionalInfo.weight && `${additionalInfo.weight}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {card.profile_type === 'agent' && additionalInfo.agency && (
                                                    <div className="text-xs text-slate-400">
                                                        Agencia: {additionalInfo.agency}
                                                    </div>
                                                )}

                                                {card.profile_type === 'team' && additionalInfo.job && (
                                                    <div className="text-xs text-slate-400">
                                                        Posición: {additionalInfo.job}
                                                    </div>
                                                )}

                                                {card.description && (
                                                    <div className="text-xs text-slate-400 mt-2 line-clamp-2">
                                                        {card.description}
                                                    </div>
                                                )}

                                                {/* Redes sociales */}
                                                {(additionalInfo.social?.instagram || additionalInfo.social?.twitter) && (
                                                    <div className="flex gap-2 mt-2">
                                                        {additionalInfo.social.instagram && (
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <FaInstagram className="text-pink-500" /> @{additionalInfo.social.instagram}
                                                            </span>
                                                        )}
                                                        {additionalInfo.social.twitter && (
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <FaTwitter className="text-blue-500" /> @{additionalInfo.social.twitter}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botón de contacto directo */}
                                            {isTop && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const userId = getProfileUserId(card);
                                                            if (userId) {
                                                                handleDirectContact(userId);
                                                            }
                                                        }}
                                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                                            isPremium
                                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        <FaPhone className="text-sm" />
                                                        {isPremium ? 'Contacto Directo' : (
                                                            <>
                                                                Contacto Directo <FaLock className="text-xs ml-1" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex gap-6">
                        <button 
                            onClick={() => handleAction('dislike')} 
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            aria-label="Dislike"
                            disabled={cards.length === 0 || loading}
                        >
                            <FaTimes className="text-xl" />
                        </button>
                        <button 
                            onClick={() => handleAction('like')} 
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            aria-label="Like"
                            disabled={cards.length === 0 || loading}
                        >
                            <FaStar className="text-xl" />
                        </button>
                    </div>

                    {/* Match Modal with Framer Motion */}
                    <AnimatePresence>
                        {showMatchModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4"
                                onClick={() => setShowMatchModal(false)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                                    transition={{ 
                                        type: "spring",
                                        damping: 25,
                                        stiffness: 300
                                    }}
                                    className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 max-w-lg w-full shadow-2xl border-2 border-blue-200 dark:border-blue-800"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="text-center">
                                        {/* Icono animado con fondo circular */}
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ 
                                                delay: 0.2,
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 15
                                            }}
                                            className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <FaStar className="text-5xl text-white" />
                                        </motion.div>
                                        
                                        <motion.h3
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-4xl font-extrabold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600"
                                        >
                                            ¡Match Creado!
                                        </motion.h3>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="mb-6 p-6 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700"
                                        >
                                            <div className="flex items-center justify-center gap-3 mb-3">
                                                <FaCheck className="text-2xl text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <p className="text-xl text-gray-700 dark:text-gray-200 mb-2">
                                                Has hecho match con
                                            </p>
                                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                                {matchedUserName}
                                            </p>
                                        </motion.div>
                                        
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-base text-gray-600 dark:text-gray-300 mb-8 px-4"
                                        >
                                            ¡Felicidades! Ahora pueden chatear. Ve a la sección de <span className="font-semibold text-blue-600 dark:text-blue-400">Chat</span> para comenzar la conversación.
                                        </motion.p>
                                        
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowMatchModal(false)}
                                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 dark:from-blue-600 dark:to-blue-800 text-white text-lg rounded-xl font-bold shadow-lg hover:shadow-2xl transition-shadow duration-200 flex items-center justify-center gap-2"
                                        >
                                            Continuar
                                            <FaStar className="text-xl" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Paywall Modal */}
                    <PaywallModal
                        isOpen={showPaywallModal}
                        onClose={() => setShowPaywallModal(false)}
                        feature={paywallFeature}
                    />

                    {/* Contact Modal */}
                    <ContactModal
                        isOpen={showContactModal}
                        onClose={() => setShowContactModal(false)}
                        contactInfo={contactInfo}
                    />
                   
                </div>
            )}
        </>
    );
}