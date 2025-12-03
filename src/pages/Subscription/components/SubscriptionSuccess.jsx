import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaBolt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { subscriptionService } from '../../../services/subscriptionService';

export function SubscriptionSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        verifyPayment();
    }, [sessionId]);

    async function verifyPayment() {
        if (!sessionId) {
            setError('No se encontró ID de sesión');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Verificar la sesión en el backend
            const data = await subscriptionService.verifySession(sessionId);
            
            if (!data.paid) {
                throw new Error('El pago no se completó');
            }

            setSessionData(data);
        } catch (err) {
            console.error('Error al verificar pago:', err);
            setError(err.response?.data?.message || err.message || 'Error al verificar el pago');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                        Verificando tu pago...
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
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Error de Verificación
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error}
                    </p>
                    <motion.button
                        onClick={() => navigate('/Suscripcion')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Volver a Suscripciones
                    </motion.button>
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
                        {sessionData ? (
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Plan</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {sessionData.plan_name || 'Premium'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Monto</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        ${sessionData.amount} {sessionData.currency?.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Estado</span>
                                    <span className="font-semibold text-green-600 capitalize">
                                        {sessionData.status}
                                    </span>
                                </div>

                                {sessionData.customer_email && (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400">Email</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {sessionData.customer_email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                                    ℹ️ Los detalles de tu suscripción se cargarán pronto. Puedes verificarlos en tu perfil.
                                </p>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="space-y-3">
                            <motion.button
                                onClick={() => navigate('/')}
                                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Ir al Inicio
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/Perfil')}
                                className="w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Ver mi Perfil
                            </motion.button>
                        </div>

                        {sessionData?.subscription_id && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-6 text-center">
                                ID de transacción: {sessionData.subscription_id}
                            </p>
                        )}
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
