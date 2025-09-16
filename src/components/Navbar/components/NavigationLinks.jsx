import React from 'react'
import { Link } from 'react-router-dom';

export function NavigationLinks({routes, isOpen}) {
  return (
    <div className='hidden md:flex items-center space-x-8'>
      <ul className='flex space-x-8'>
        {routes.map((route) => (
          <Link 
            key={route.path}
            to={route.path}
            className='text-gray-700 text-lg dark:text-white border-b-2 border-transparent hover:border-blue-600 dark:hover:border-white cursor-pointer'
          >
            {route.name}
          </Link>
        ))}
      </ul>
    </div>
  );
}
