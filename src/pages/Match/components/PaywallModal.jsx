import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaBolt, FaFilter, FaPhone, FaSearch, FaBullseye, FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function PaywallModal({ isOpen, onClose, feature = 'unlimited_swipes' }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const features = {
        unlimited_swipes: {
            title: '¡Límite de Swipes Alcanzado!',
            message: 'Has usado tus 10 swipes gratuitos de hoy.',
            benefits: [
                'Swipes ilimitados cada día',
                'No más esperas de 24 horas',
                'Conecta con más personas',
                'Filtros avanzados por tipo de perfil',
                'Contacto directo sin match'
            ]
        },
        profile_filters: {
            title: 'Filtros Avanzados',
            message: 'Los filtros por tipo de perfil son exclusivos para usuarios premium.',
            benefits: [
                'Filtra por equipos o agentes',
                'Encuentra exactamente lo que buscas',
                'Ahorra tiempo en tu búsqueda',
                'Swipes ilimitados',
                'Contacto directo sin match'
            ]
        },
        direct_contact: {
            title: 'Contacto Directo',
            message: 'El contacto directo sin match es exclusivo para usuarios premium.',
            benefits: [
                'Contacta sin necesidad de match',
                'Acceso a email y teléfono',
                'Redes sociales directas',
                'Swipes ilimitados',
                'Filtros avanzados'
            ]
        }
    };

    const featureData = features[feature] || features.unlimited_swipes;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FaBolt className="text-2xl text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Actualiza a Premium
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                        {feature === 'profile_filters' && <FaSearch className="text-blue-500" />}
                        {feature === 'unlimited_swipes' && <FaBullseye className="text-blue-500" />}
                        {feature === 'direct_contact' && <FaPhoneAlt className="text-blue-500" />}
                        {featureData.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {featureData.message}
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                            <FaBolt className="text-blue-500" />
                            Beneficios Premium:
                        </h4>
                        <ul className="space-y-2">
                            {featureData.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            navigate('/Suscripcion');
                            onClose();
                        }}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg font-semibold shadow-lg transition-all"
                    >
                        Ver Planes Premium
                    </motion.button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                    >
                        {feature === 'unlimited_swipes' ? 'Volver Mañana' : 'Ahora No'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
