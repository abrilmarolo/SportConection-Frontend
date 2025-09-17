import React from 'react'
import { useAuth } from '../../context/AuthContext';

export function Map() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {!isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-red-700 dark:bg-red-900 rounded-lg">
                        <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
                        <p className="mt-2 text-white">Debes iniciar sesión para ver el mapa</p>
                    </div>
                </div>
            ) : (
                <div className='min-h-screen m-4 dark:text-white' >Mapas</div>
            )}
        </>
    );
}

