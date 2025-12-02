import React from 'react'
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { routes } from '../../../routes/routes';
import { motion } from 'framer-motion';
export function NavButtons({ user, isAuthenticated }) {
    const { logout } = useAuth();

    if (isAuthenticated) {
        return (
            <div className="flex items-center space-x-4">
                <Link to="/profile">
                    <img
                        src={user?.profileImage || '/img/default-avatar.png'}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    />
                </Link>
                <motion.button
                    onClick={logout}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700  dark:bg-red-800 dark:hover:bg-red-900 rounded-lg hidden md:block"
                >
                    Cerrar Sesión
                </motion.button>
            </div>
        );
    }

    return (
        <div className='hidden md:flex items-center space-x-4'>
            {routes.map((route) => (
                <motion.div
                    key={route.path}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    <Link
                        to={route.path}
                        className={route.path === '/Registro'
                            ? 'px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg block'
                            : 'px-4 py-2 text-blue-600 dark:text-white border border-blue-600 dark:border-white rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 block'
                        }
                    >
                        {route.name}
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
