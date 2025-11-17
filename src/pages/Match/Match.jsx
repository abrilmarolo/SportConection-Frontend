import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export function Match() {
    const { isAuthenticated } = useAuth();

    // Estados para swipe-cards
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [matchNotice, setMatchNotice] = useState(null);
    
    // Estados para filtros
    const [profileTypeFilter, setProfileTypeFilter] = useState('');
    const [userProfileType, setUserProfileType] = useState(null);
    const [userSportId, setUserSportId] = useState(null);
    const [availableTypes, setAvailableTypes] = useState([]);
    
    const topCardRef = useRef(null);
    const pointerData = useRef({ dragging: false, startX: 0, currentX: 0 });

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchDiscover();
    }, [isAuthenticated, profileTypeFilter]);

    async function fetchDiscover() {
        try {
            setLoading(true);
            setError(null);
            
            const params = { limit: 10 };
            if (profileTypeFilter) {
                params.profile_type_filter = profileTypeFilter;
            }
            
            console.log('🔍 Fetching discover with params:', params);
            
            const response = await api.get('/swipe/discover', { params });
            
            console.log('✅ Discover response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.error || 'Error desconocido del servidor');
            }
            
            setCards(response.data.users || []);
            setUserProfileType(response.data.user_profile_type);
            setUserSportId(response.data.user_sport_id);
            
            // Determinar tipos disponibles según el tipo de perfil del usuario
            // Según la API: Athletes ven teams y agents, Teams/Agents ven athletes
            if (response.data.user_profile_type === 'athlete') {
                setAvailableTypes(['team', 'agent']);
            } else {
                setAvailableTypes(['athlete']);
            }
            
        } catch (err) {
            console.error('💥 Error in fetchDiscover:', err);
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
    }

    function getProfileUserId(profile) {
        if (!profile) return null;
        if (profile.user_id) return profile.user_id;
        if (profile.user && profile.user.id) return profile.user.id;
        return null;
    }

    // Función para mostrar modal de confirmación de match
    function showMatchModal(matchedUserName = 'tu nuevo match') {
        // Crear y mostrar modal personalizado
        const modalContent = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="matchModal">
                <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm mx-4 text-center">
                    <div class="text-4xl mb-4">🎉</div>
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">¡Match Creado!</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                        Has hecho match con <strong>${matchedUserName}</strong>
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Ve a la sección de Chat para contactar a tu match
                    </p>
                    <div class="flex gap-2 justify-center">
                        <button onclick="closeMatchModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Agregar modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalContent);

        // Función global para el modal
        window.closeMatchModal = () => {
            const modal = document.getElementById('matchModal');
            if (modal) modal.remove();
        };

        // Cerrar modal al hacer clic fuera
        document.getElementById('matchModal').addEventListener('click', (e) => {
            if (e.target.id === 'matchModal') {
                window.closeMatchModal();
            }
        });
    }

    async function sendSwipe(swipedUserId, action, userName) {
        try {
            console.log(`🎯 Sending swipe: ${action} for user ${swipedUserId}`);
            
            const response = await api.post('/swipe', {
                swiped_user_id: swipedUserId,
                action
            });
            
            console.log('📤 Swipe response:', response.data);
            
            // Según la API, la respuesta es: { success: true, match: true/false, message: "..." }
            if (!response.data.success) {
                throw new Error(response.data.error || 'Error en el swipe');
            }
            
            // Si hay match, mostrar notificación y modal
            if (response.data.match) {
                setMatchNotice(`¡Match creado! 🎉 ${response.data.message || ''}`);
                setTimeout(() => setMatchNotice(null), 4000);
                
                // Mostrar modal de match con el nombre del usuario
                setTimeout(() => {
                    showMatchModal(userName);
                }, 1000);
            }
            
            return response.data;
        } catch (err) {
            console.error('💥 Error in sendSwipe:', err);
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

        return (
            <div className="mb-4 flex gap-2 flex-wrap justify-center">
                <button
                    onClick={() => setProfileTypeFilter('')}
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
                        onClick={() => setProfileTypeFilter('team')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            profileTypeFilter === 'team' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        Teams
                    </button>
                )}
                {availableTypes.includes('agent') && (
                    <button
                        onClick={() => setProfileTypeFilter('agent')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            profileTypeFilter === 'agent' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        Agents
                    </button>
                )}
            </div>
        );
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
                    <div className="flex items-center justify-center w-full max-w-md mb-4">
                        <h1 className="text-2xl font-semibold">Match</h1>
                    </div>

                    {/* User info */}
                    {userProfileType && (
                        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                            Perfil: <span className="capitalize font-medium">{userProfileType}</span>
                            {userSportId && <span> • Sport ID: {userSportId}</span>}
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
                                <span className="text-red-500">⚠️</span>
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
                            <span>🎉</span>
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
                                                <div className="text-slate-600 dark:text-slate-300 p-6 text-center">
                                                    <div className="text-4xl mb-2">
                                                        {card.profile_type === 'team' ? '🏆' : 
                                                         card.profile_type === 'agent' ? '🤝' : '⚽'}
                                                    </div>
                                                    <div>{fullName}</div>
                                                </div>
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
                                                            <span className="text-xs text-slate-400">📷 @{additionalInfo.social.instagram}</span>
                                                        )}
                                                        {additionalInfo.social.twitter && (
                                                            <span className="text-xs text-slate-400">🐦 @{additionalInfo.social.twitter}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
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
                            ✖
                        </button>
                        <button 
                            onClick={() => handleAction('like')} 
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            aria-label="Like"
                            disabled={cards.length === 0 || loading}
                        >
                            ❤
                        </button>
                    </div>

                    {/* Control buttons */}
                    <div className="mt-6">
                        <button 
                            className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" 
                            onClick={fetchDiscover}
                            disabled={loading}
                        >
                            Recargar perfiles
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}