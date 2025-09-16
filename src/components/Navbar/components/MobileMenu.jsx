import React from 'react';
import { Link } from 'react-router-dom';

export function MobileMenu({ isOpen, routes}) {
  return (
    isOpen && (
      <div className='md:hidden mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg'>
        <ul className='flex flex-col space-y-4 p-4'>
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className='text-gray-700 px-2 rounded-sm dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900'
            >
              {route.name}
            </Link>
          ))}
        </ul>
      </div>
    )
  );
}