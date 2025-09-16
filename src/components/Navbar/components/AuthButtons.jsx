import { Link } from 'react-router-dom';
import { ToggleDarkMode } from './ToggleDarkMode';

import React from 'react'
export function AuthButtons({ routes}) {
  return (
    <div className='hidden md:flex items-center space-x-4'>
      {routes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={route.path === '/Registro' 
            ? 'px-2 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg'
            : 'px-2 py-2 text-blue-600 dark:text-white border border-blue-600 dark:border-white rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800'
          }
        >
          {route.name}
        </Link>
      ))}
    </div>
  );
}
