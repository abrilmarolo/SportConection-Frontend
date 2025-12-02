import React, { useState, useEffect } from 'react';

export function ToggleDarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        // Inicializar con el valor del localStorage o false
        return localStorage.getItem('darkMode') === 'true';
    });

    // Efecto para sincronizar el estado con el localStorage y las clases
    useEffect(() => {
        // Verificar el tema actual
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        
        // Aplicar el tema
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Observer para detectar cambios en la clase 'dark'
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkMode = document.documentElement.classList.contains('dark');
                    setDarkMode(isDarkMode);
                    localStorage.setItem('darkMode', isDarkMode);
                }
            });
        });

        // Configurar el observer
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Limpiar el observer cuando el componente se desmonte
        return () => observer.disconnect();
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', newDarkMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            {darkMode ? (
                <img 
                    className='cursor-pointer w-6 h-6' 
                    src="/img/modo-claro.png" 
                    alt="Modo Claro"
                />
            ) : (
                <img 
                    className='cursor-pointer w-6 h-6' 
                    src="/img/modo-oscuro.png" 
                    alt="Modo Oscuro"
                />
            )}
        </button>
    );
}