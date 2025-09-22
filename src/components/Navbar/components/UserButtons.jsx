import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../../routes/routes';
import { useAuth } from '../../../context/AuthContext';
import { profileRoute } from '../../../routes/routes';

export function UserButtons({ user }) {
  const { logout } = useAuth();

  return (
    <div className="flex items-center space-x-4">
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
        className="px-2 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg hidden md:block cursor-pointer"
      >
        Cerrar Sesión
      </button>


    </div>
  );
}