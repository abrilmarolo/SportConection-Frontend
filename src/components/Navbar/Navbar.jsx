import React, { useState } from 'react';
import { HamburgerMenu } from './components/HamburgerMenu';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { MobileMenu } from './components/MobileMenu';
import { Logo } from './components/Logo';
import { NavigationLinks } from './components/NavigationLinks';
import { ToggleDarkMode } from './components/ToggleDarkMode';
import { AuthButtons } from './components/AuthButtons';
import { UserButtons } from './components/UserButtons';
import { publicRoutes, userRoutes, adminRoutes, authRoutes } from '../../routes/routes';
import { FaBolt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  const getNavigationRoutes = () => {
    if (!isAuthenticated) {
      return publicRoutes;
    }

    if (isAdmin) {
      return adminRoutes;
    }

    return userRoutes;
  };

  return (
    <header className='bg-white dark:bg-gray-900 dark:border-b-1 dark:border-gray-700 shadow-md px-2 py-4'>
      <nav className='mx-auto'>
        <div className='flex justify-between items-center'>
          <Logo />
          <NavigationLinks routes={getNavigationRoutes()} />
          
          
          
          <div className='hidden md:flex items-center space-x-3'>
            
            {isAuthenticated ? (
              <UserButtons user={user} />
            ) : (
              <AuthButtons routes={authRoutes} />
            )}

            <div className="border-l border-gray-300 dark:border-gray-700 h-8 mx-2" />
            <ToggleDarkMode />
          </div>

          <div className='flex justify-end space-x-2 md:hidden'>
            <ToggleDarkMode />
            <div className="border-l border-gray-300 dark:border-gray-700 h-10 mr-4" />
            <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>

        <MobileMenu 
          isOpen={isOpen} 
          routes={getNavigationRoutes()} 
        />
      </nav>
    </header>
  );
}