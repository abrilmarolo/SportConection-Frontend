import React from 'react'
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <div className='flex items-center'>
      <Link to="/" className=' mr-4'>
        <img 
          src="/img/icono-provisorio.png" 
          alt="Logo" 
          className='h-8 w-auto'
        />
      </Link>
      <Link className='hidden lg:block text-2xl font-semibold dark:text-white hover:opacity-90 transition-opacity' to="/">
        SportConnection
      </Link>
      
    </div>
  );
}
