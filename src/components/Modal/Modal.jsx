import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal container */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-xl sm:max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
