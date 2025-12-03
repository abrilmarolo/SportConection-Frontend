import React from 'react';
import { FaTimes, FaEnvelope, FaPhone, FaInstagram, FaTwitter, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export function ContactModal({ isOpen, onClose, contactInfo }) {
    if (!isOpen || !contactInfo) return null;

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado al portapapeles`, {
            position: "bottom-center",
            autoClose: 2000
        });
    };

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
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Información de Contacto
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {contactInfo.name} {contactInfo.last_name}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full capitalize">
                            {contactInfo.profile_type}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                    {contactInfo.contact_info.email && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                                            {contactInfo.contact_info.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(contactInfo.contact_info.email, 'Email')}
                                    className="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                >
                                    <FaCopy className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>
                    )}

                    {contactInfo.contact_info.phone && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <FaPhone className="text-green-600 dark:text-green-400 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {contactInfo.contact_info.phone}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(contactInfo.contact_info.phone, 'Teléfono')}
                                    className="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                >
                                    <FaCopy className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>
                    )}

                    {contactInfo.contact_info.instagram && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <FaInstagram className="text-pink-600 dark:text-pink-400 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Instagram</p>
                                        <a
                                            href={`https://instagram.com/${contactInfo.contact_info.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {contactInfo.contact_info.instagram}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {contactInfo.contact_info.twitter && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <FaTwitter className="text-blue-500 dark:text-blue-400 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Twitter</p>
                                        <a
                                            href={`https://twitter.com/${contactInfo.contact_info.twitter.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {contactInfo.contact_info.twitter}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
