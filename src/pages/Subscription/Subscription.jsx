
import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../context/AuthContext';
import { FaBolt, FaTimes, FaCheck } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';
import { motion } from 'framer-motion';

export function Subscription() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [processingCheckout, setProcessingCheckout] = useState(null); // Cambiado a null para guardar el planId
    const [showPlansModal, setShowPlansModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    // Cargar planes
    useEffect(() => {
        loadPlans();
    }, []);

    // Cargar estado de suscripción si está autenticado
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            loadSubscriptionStatus();
        }
    }, [isAuthenticated, authLoading]);

    async function loadPlans() {
        try {
            setLoading(true);
            setError(null);
            const data = await subscriptionService.getPublicPlans();
            setPlans(data);
        } catch (err) {
            console.error('Error al cargar planes:', err);
            setError('Error al cargar los planes. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    async function loadSubscriptionStatus() {
        try {
            const status = await subscriptionService.getSubscriptionStatus();
            console.log('✅ Estado de suscripción cargado:', status);
            console.log('Status value:', status?.subscription_details?.status);
            console.log('End date:', status?.subscription_details?.end_date);
            setSubscriptionStatus(status);
        } catch (err) {
            const isNoSubscription = err.response?.status === 404 || err.response?.status === 500;

            if (isNoSubscription) {
                // Usuario sin suscripción → dejamos null
                console.log('ℹ️ Usuario sin suscripción activa (error esperado)');
                setSubscriptionStatus(null);
            } else {
                console.error('❌ Error inesperado al cargar estado de suscripción:', err);
                setError('Error al cargar el estado de tu suscripción.');
            }
        }
    }


    async function handleAcquirePlan(planId) {
        console.log('🔵 Iniciando proceso de compra...');
        console.log('isAuthenticated:', isAuthenticated);
        console.log('subscriptionStatus completo:', subscriptionStatus);
        
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para adquirir un plan.');
            return;
        }

        // Verificar si tiene suscripción ACTIVA (no vencida ni cancelada)
        const daysRemaining = calculateDaysRemaining();
        const hasActiveSubscription = subscriptionStatus?.subscription_details?.status === 'active' && 
                                      daysRemaining > 0;

        console.log('📊 Verificación de suscripción:');
        console.log('  - Status:', subscriptionStatus?.subscription_details?.status);
        console.log('  - Días restantes:', daysRemaining);
        console.log('  - Tiene suscripción activa?', hasActiveSubscription);

        if (hasActiveSubscription) {
            console.log('⛔ Bloqueado: Ya tiene suscripción activa');
            setError('Ya tienes una suscripción activa. Espera a que venza para adquirir un nuevo plan.');
            return;
        }

        try {
            setProcessingCheckout(planId); // Guardar el planId que está procesando
            setError(null);
            
            console.log('✅ Permitido: Creando checkout session...');
            console.log('Plan ID:', planId);
            
            const data = await subscriptionService.createCheckoutSession(planId);
            
            // Redirigir a Stripe Checkout - el backend retorna checkout_url
            if (data.checkout_url) {
                console.log('🔗 Redirigiendo a Stripe:', data.checkout_url);
                window.location.href = data.checkout_url;
            } else {
                console.error('❌ No se recibió checkout_url del backend');
                setError('No se pudo crear la sesión de pago.');
            }
        } catch (err) {
            console.error('❌ Error al crear sesión de checkout:', err);
            console.error('Response data:', err.response?.data);
            console.error('Status code:', err.response?.status);
            
            // Mensajes de error más específicos
            const errorMessage = err.response?.data?.message || err.response?.data?.error;
            
            if (errorMessage) {
                setError(errorMessage);
            } else if (err.response?.status === 500) {
                setError('Error al procesar la solicitud. Intenta nuevamente o contacta al administrador.');
            } else if (err.response?.status === 400) {
                setError('Solicitud inválida. Verifica los datos del plan.');
            } else {
                setError('Error al procesar tu solicitud. Intenta nuevamente.');
            }
        } finally {
            setProcessingCheckout(null); // Limpiar el estado
        }
    }

    function openStatusModal() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    function openPlansModal() {
        setShowPlansModal(true);
    }

    function closePlansModal() {
        setShowPlansModal(false);
    }

    async function handleCancelSubscription() {
        if (!window.confirm('¿Estás seguro de que deseas cancelar tu suscripción? Perderás todos los beneficios premium.')) {
            return;
        }

        try {
            setCancelling(true);
            setError(null);
            await subscriptionService.cancelSubscription();
            
            // Recargar el estado de suscripción
            await loadSubscriptionStatus();
            
            alert('Tu suscripción ha sido cancelada exitosamente.');
        } catch (err) {
            console.error('Error al cancelar suscripción:', err);
            setError(err.response?.data?.message || 'Error al cancelar la suscripción. Intenta nuevamente.');
        } finally {
            setCancelling(false);
        }
    }

    function calculateDaysRemaining() {
        if (!subscriptionStatus?.subscription_details?.end_date) return 0;
        const endDate = new Date(subscriptionStatus.subscription_details.end_date);
        const today = new Date();
        const diff = endDate - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    return (
        <>
            {!isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-red-700 dark:bg-red-900 rounded-lg">
                        <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
                        <p className="mt-2 text-white">Debes iniciar sesión para ver los planes de suscripción</p>
                    </div>
                </div>
            ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaBolt className="text-5xl text-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {subscriptionStatus?.active || subscriptionStatus?.subscription_details?.status === 'active'
                            ? 'Tu Suscripción Premium' 
                            : 'Planes Premium'}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {subscriptionStatus?.active || subscriptionStatus?.subscription_details?.status === 'active'
                            ? 'Gestiona tu suscripción activa'
                            : 'Potencia tu experiencia con nuestros planes de suscripción'}
                    </p>
                </div>

                {/* Vista para USUARIOS SUSCRITOS */}
                {subscriptionStatus?.active || subscriptionStatus?.subscription_details?.status === 'active' ? (
                    <div className="max-w-3xl mx-auto">
                        {/* Card principal de suscripción */}
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <FaBolt className="text-5xl text-yellow-300" />
                                    <div>
                                        <h2 className="text-3xl font-bold">{subscriptionStatus?.subscription_details?.plan_name || 'Premium'}</h2>
                                        <p className="text-blue-100">Suscripción Activa</p>
                                    </div>
                                </div>
                                <FaCheck className="text-4xl text-green-300" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <p className="text-blue-200 text-sm mb-2">Fecha de inicio</p>
                                    <p className="text-xl font-semibold">{formatDate(subscriptionStatus?.subscription_details?.start_date)}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <p className="text-blue-200 text-sm mb-2">Días restantes</p>
                                    <p className="text-3xl font-bold text-yellow-300">{calculateDaysRemaining()}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <p className="text-blue-200 text-sm mb-2">Fecha de vencimiento</p>
                                    <p className="text-xl font-semibold">{formatDate(subscriptionStatus?.subscription_details?.end_date)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.button
                                onClick={openPlansModal}
                                className="py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg"
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                            >
                                Renovar Suscripción
                            </motion.button>
                            <motion.button
                                onClick={handleCancelSubscription}
                                disabled={cancelling}
                                className="py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all shadow-lg disabled:cursor-not-allowed"
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                            >
                                {cancelling ? 'Cancelando...' : 'Cancelar Suscripción'}
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    /* Vista para USUARIOS NO SUSCRITOS */
                    <>
                        {/* Error message */}
                        {error && (
                            <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <span className="text-red-500">⚠️</span>
                                    <div className="flex-1">
                                        <p className="font-semibold">Error:</p>
                                        <p className="text-sm mt-1">{error}</p>
                                    </div>
                                    <motion.button 
                                        onClick={() => setError(null)}
                                        className="text-red-500 hover:text-red-700"
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <FaTimes />
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Loading state */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            /* Plans grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                                    >
                                        <div className="p-8">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                {plan.name}
                                            </h3>
                                            <div className="mb-6">
                                                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                                    ${plan.price}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-400 ml-2">
                                                    / mes
                                                </span>
                                            </div>

                                            <motion.button
                                                onClick={() => handleAcquirePlan(plan.id)}
                                                disabled={processingCheckout !== null || !isAuthenticated}
                                                className="w-full py-3 px-6 rounded-lg font-semibold transition-colors bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ duration: 0.1 }}
                                            >
                                                {processingCheckout === plan.id ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Procesando...
                                                    </span>
                                                ) : !isAuthenticated ? (
                                                    'Inicia Sesión para Adquirir'
                                                ) : (
                                                    'Adquirir Plan'
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Modal de planes (para renovación) */}
                <Modal isOpen={showPlansModal} onClose={closePlansModal}>
                        <motion.button
                            onClick={closePlansModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                        >
                            <FaTimes className="text-2xl" />
                        </motion.button>

                        <div className="text-center mb-8">
                            <FaBolt className="text-5xl text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Renueva tu Suscripción
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Elige el plan que mejor se adapte a tus necesidades
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            {plan.name}
                                        </h3>
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                                ${plan.price}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400 ml-2">
                                                / mes
                                            </span>
                                        </div>
                                        <motion.button
                                            onClick={() => {
                                                closePlansModal();
                                                handleAcquirePlan(plan.id);
                                            }}
                                            disabled={processingCheckout !== null}
                                            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            {processingCheckout === plan.id ? 'Procesando...' : 'Seleccionar Plan'}
                                        </motion.button>
                                    </div>
                                ))}
                            </div>
                        )}
                </Modal>

                {/* Modal de estado de suscripción */}
                <Modal isOpen={showModal && !!subscriptionStatus} onClose={closeModal}>
                        <motion.button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                        >
                            <FaTimes className="text-2xl" />
                        </motion.button>

                        <div className="text-center mb-6">
                            <FaBolt className="text-5xl text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Tu Suscripción Premium
                            </h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Plan Actual
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {subscriptionStatus?.subscription_details?.plan_name || 'Premium'}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Fecha de Compra
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatDate(subscriptionStatus?.subscription_details?.start_date)}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Días Restantes
                                </p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {calculateDaysRemaining()} días
                                </p>
                            </div>

                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Vence el
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatDate(subscriptionStatus?.subscription_details?.end_date)}
                                </p>
                            </div>
                        </div>

                        <motion.button
                            onClick={() => {
                                closeModal();
                            }}
                            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                        >
                            Renovar Suscripción
                        </motion.button>
                </Modal>
            </div>
        </div>
            )}
        </>
    );
}