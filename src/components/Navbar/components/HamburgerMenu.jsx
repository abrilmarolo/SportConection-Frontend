import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../../routes/routes';
import { useAuth } from '../../../context/AuthContext';
import { profileRoute } from '../../../routes/routes';

export function HamburgerMenu({ isOpen, setIsOpen }) {
  const registerRoute = routes.find(route => route.path === '/Registro');
  const { logout } = useAuth();
  const { isAuthenticated, user } = useAuth();
  return (
    <div className='md:hidden flex items-center'>
      {isAuthenticated ? (
        <div className="flex items-center space-x-3">
          <Link
            to={profileRoute.path}
            className="flex items-center space-x-2"
          >
            <img
              src={user?.profileImage || '/img/perfil-provisorio.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg mr-2 cursor-pointer "
          >
            Cerrar Sesión
          </button>
        </div>



      ) : (
        <Link
          to="/Registro"
          className='px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg mr-2'>
          {registerRoute.name}
        </Link>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className='text-gray-700 dark:text-white focus:outline-none'
      >
        {isOpen ? (
          <svg className="h-6 w-6 cur cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </div>
  );
}