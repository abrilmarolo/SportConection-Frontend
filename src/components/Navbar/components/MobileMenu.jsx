import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileMenu({ isOpen, routes}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='md:hidden mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'
        >
          <ul className='flex flex-col space-y-4 p-4'>
            {routes.map((route, index) => (
              <motion.div
                key={route.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Link
                  to={route.path}
                  className='text-gray-700 px-2 rounded-sm dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900 block'
                >
                  {route.name}
                </Link>
              </motion.div>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}