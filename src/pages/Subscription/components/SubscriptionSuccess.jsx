import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaBolt } from 'react-icons/fa';
import { subscriptionService } from '../../../services/subscriptionService';

export function SubscriptionSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [retryMessage, setRetryMessage] = useState('');

    useEffect(() => {
        verifyPayment();
    }, []);

    async function verifyPayment() {
        try {
            setVerifying(true);
            setError(null);

            // Primero verificar el pago
            setRetryMessage('Verificando tu pago...');
            await subscriptionService.verifyPaymentStatus();
            
            // Esperar un momento para que el backend procese
            setRetryMessage('Procesando tu suscripción...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reintentar obtener la suscripción hasta 5 veces con delay
            let attempts = 0;
            let data = null;
            
            while (attempts < 5 && !data) {
                try {
                    setRetryMessage(`Cargando detalles de tu suscripción... (${attempts + 1}/5)`);
                    data = await subscriptionService.getSubscriptionStatus();
                    setSubscriptionData(data);
                    setRetryMessage('');
                    break;
                } catch (err) {
                    attempts++;
                    // Silenciar logs de reintentos para no alarmar
                    
                    if (attempts < 5) {
                        // Esperar 3 segundos antes de reintentar
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    } else {
                        // Último intento falló - pero no es un error crítico
                        // El pago fue exitoso, solo falta que el backend procese la suscripción
                        setRetryMessage('');
                        setVerifying(false);
                        // No lanzamos error, mostramos pantalla de éxito sin detalles
                        return;
                    }
                }
            }
        } catch (err) {
            console.error('Error al verificar pago:', err);
            setError('No se pudo verificar tu pago. Tu suscripción puede tardar unos minutos en activarse. Por favor recarga la página o contacta a soporte.');
        } finally {
            setVerifying(false);
            setRetryMessage('');
        }
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        // Si la fecha viene en formato YYYY-MM-DD, añadir 'T00:00:00' para evitar problemas de zona horaria
        const dateStr = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'UTC'
        });
    }

    if (verifying) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                        {retryMessage || 'Verificando tu pago...'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Por favor espera un momento
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Error de Verificación
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => navigate('/Suscripcion')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
                    >
                        Volver a Suscripciones
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Tarjeta de éxito */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header con animación */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-500 dark:from-blue-900 dark:to-blue-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute transform rotate-45 bg-white w-32 h-32 -top-10 -right-10"></div>
                            <div className="absolute transform -rotate-45 bg-white w-24 h-24 -bottom-10 -left-10"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="inline-block animate-bounce mb-4">
                                <FaCheckCircle className="text-7xl text-green-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                ¡Pago Exitoso!
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Tu suscripción ha sido activada
                            </p>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                                <FaBolt className="text-white" />
                                <span className="font-semibold text-white">
                                    Premium Activado
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Ahora tienes acceso a todas las funciones premium
                            </p>
                        </div>

                        {/* Detalles de la suscripción */}
                        {subscriptionData && subscriptionData.subscription_details ? (
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Plan adquirido</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {subscriptionData.subscription_details.plan_name || 'Premium'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Fecha de inicio</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatDate(subscriptionData.subscription_details.start_date)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Válido hasta</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatDate(subscriptionData.subscription_details.end_date)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                                    ℹ️ Los detalles de tu suscripción se cargarán pronto. Puedes verificarlos en tu perfil.
                                </p>
                            </div>
                        )}

                        {/* Botón de acción */}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                            Ir al Inicio
                        </button>

                        
                    </div>
                </div>

                {/* Footer de confianza */}
                <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    <p>🔒 Transacción segura procesada por Stripe</p>
                </div>
            </div>
        </div>
    );
}
