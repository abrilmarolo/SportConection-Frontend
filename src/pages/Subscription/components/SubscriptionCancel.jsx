import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaBolt } from 'react-icons/fa';

export function SubscriptionCancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Tarjeta de cancelación */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute transform rotate-45 bg-white w-32 h-32 -top-10 -right-10"></div>
                            <div className="absolute transform -rotate-45 bg-white w-24 h-24 -bottom-10 -left-10"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="inline-block mb-4">
                                <FaExclamationTriangle className="text-7xl text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Pago Cancelado
                            </h1>
                            <p className="text-yellow-100 text-lg">
                                No se realizó ningún cargo a tu tarjeta
                            </p>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                                El proceso de pago fue cancelado. Si tuviste algún problema, 
                                puedes intentarlo nuevamente o contactar con soporte.
                            </p>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
                                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center justify-center gap-2">
                                    <span>💡</span>
                                    <span>¿Por qué podría haber fallado?</span>
                                </h3>
                                <ul className="text-sm text-yellow-700 dark:text-yellow-300 text-left space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Fondos insuficientes en la tarjeta</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Datos de la tarjeta incorrectos</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Transacción rechazada por el banco</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Sesión de pago expirada</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/Suscripcion')}
                                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <FaBolt />
                                <span>Volver a Intentar</span>
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-all"
                            >
                                Volver al Inicio
                            </button>

                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ¿Necesitas ayuda?{' '}
                                    <button
                                        onClick={() => navigate('/Contacto')}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                                    >
                                        Contacta con soporte
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer informativo */}
                <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    <p>🔒 Tus datos están protegidos y seguros con Stripe</p>
                </div>
            </div>
        </div>
    );
}
