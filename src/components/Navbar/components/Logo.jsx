import React from 'react'
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <div className='flex items-center'>
      <Link to="/" className=' mx-2'>
        <img 
          src="/img/logo-blanco.jpg" 
          alt="Logo" 
          className='h-10 w-auto dark:hidden'
        />
        <img 
          src="/img/logo-negro.jpg" 
          alt="Logo" 
          className='h-8 w-auto hidden dark:block'
        />
      </Link>
      <Link className='hidden lg:block text-2xl font-semibold dark:text-white hover:opacity-90 transition-opacity mr-4' to="/">
        SportConnection
      </Link>
      
    </div>
  );
}
