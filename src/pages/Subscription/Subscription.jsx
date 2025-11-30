
import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../context/AuthContext';
import { FaBolt, FaTimes, FaCheck } from 'react-icons/fa';

export function Subscription() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [processingCheckout, setProcessingCheckout] = useState(false);

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
            setSubscriptionStatus(status);
        } catch (err) {
            // Si no hay suscripción activa (404 o 500), simplemente no hacemos nada
            // El estado se mantiene en null y la UI no muestra nada
            const isNoSubscription = err.response?.status === 404 || err.response?.status === 500;
            
            if (!isNoSubscription) {
                console.error('Error al cargar estado de suscripción:', err);
                setError('Error al cargar el estado de tu suscripción.');
            }
        }
    }

    async function handleAcquirePlan(planId) {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para adquirir un plan.');
            return;
        }

        try {
            setProcessingCheckout(true);
            setError(null);
            const data = await subscriptionService.createCheckoutSession(planId);
            
            // Redirigir a Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError('No se pudo crear la sesión de pago.');
            }
        } catch (err) {
            console.error('Error al crear sesión de checkout:', err);
            
            // Mensajes de error más específicos
            if (err.response?.status === 500) {
                setError('Error al procesar la solicitud. Intenta nuevamente o contacta al administrador.');
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || 'Solicitud inválida. Verifica los datos del plan.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al procesar tu solicitud. Intenta nuevamente.');
            }
        } finally {
            setProcessingCheckout(false);
        }
    }

    function openStatusModal() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    function calculateDaysRemaining() {
        if (!subscriptionStatus?.end_date) return 0;
        const endDate = new Date(subscriptionStatus.end_date);
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaBolt className="text-5xl text-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Planes Premium
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Potencia tu experiencia con nuestros planes de suscripción
                    </p>
                </div>

                {/* Estado de suscripción activa */}
                {subscriptionStatus && subscriptionStatus.status === 'active' && (
                    <div className="mb-8 p-6 bg-green-100 dark:bg-green-900 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaCheck className="text-2xl text-green-600 dark:text-green-400" />
                                <div>
                                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                                        Suscripción Activa
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Plan: {subscriptionStatus.plan?.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={openStatusModal}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-red-500">⚠️</span>
                            <div className="flex-1">
                                <p className="font-semibold">Error:</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                            <button 
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTimes />
                            </button>
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

                                    <button
                                        onClick={() => handleAcquirePlan(plan.id)}
                                        disabled={
                                            processingCheckout || 
                                            !isAuthenticated ||
                                            (subscriptionStatus && subscriptionStatus.status === 'active')
                                        }
                                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                                            subscriptionStatus && subscriptionStatus.status === 'active'
                                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                        }`}
                                    >
                                        {processingCheckout ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Procesando...
                                            </span>
                                        ) : subscriptionStatus && subscriptionStatus.status === 'active' ? (
                                            'Plan Activo'
                                        ) : !isAuthenticated ? (
                                            'Inicia Sesión para Adquirir'
                                        ) : (
                                            'Adquirir Plan'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de estado de suscripción */}
                {showModal && subscriptionStatus && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <FaTimes className="text-2xl" />
                            </button>

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
                                        {subscriptionStatus.plan?.name}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Fecha de Compra
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {formatDate(subscriptionStatus.start_date)}
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
                                        {formatDate(subscriptionStatus.end_date)}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    closeModal();
                                    // Aquí podrías redirigir a renovación o mostrar planes
                                }}
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Renovar Suscripción
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}