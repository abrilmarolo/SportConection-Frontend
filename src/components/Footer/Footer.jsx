import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export function Footer() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <footer className=" py-8 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 dark:border-t-1 dark:border-gray-700 flex justify-center w-full  ">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">SportConnection</h3>
            <p className="text-sm">Conectando atletas, representantes y equipos de manera profesional.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Enlaces</h4>
            <ul className="space-y-2">
              {/* Enlaces solo para NO autenticados */}
              {!isAuthenticated && (
                <>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/AcercaDeNosotros" className="hover:text-blue-500 dark:hover:text-blue-400">Acerca de</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Contacto" className="hover:text-blue-500 dark:hover:text-blue-400">Contacto</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/PreguntasFrecuentes" className="hover:text-blue-500 dark:hover:text-blue-400">Preguntas Frecuentes</Link>
                    </motion.div>
                  </li>
                </>
              )}
              
              {/* Enlaces solo para usuarios autenticados */}
              {isAuthenticated && !isAdmin && (
                <>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Publicaciones" className="hover:text-blue-500 dark:hover:text-blue-400">Publicaciones</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Match" className="hover:text-blue-500 dark:hover:text-blue-400">Match</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Chat" className="hover:text-blue-500 dark:hover:text-blue-400">Chat</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Mapa" className="hover:text-blue-500 dark:hover:text-blue-400">Mapa</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Perfil" className="hover:text-blue-500 dark:hover:text-blue-400">Mi Perfil</Link>
                    </motion.div>
                  </li>
                </>
              )}
              
              {/* Enlaces solo para admin */}
              {isAdmin && (
                <>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Admin/Usuarios" className="hover:text-blue-500 dark:hover:text-blue-400">Usuarios</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Admin/Deportes" className="hover:text-blue-500 dark:hover:text-blue-400">Deportes</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                      <Link to="/Admin/Ubicaciones" className="hover:text-blue-500 dark:hover:text-blue-400">Ubicaciones</Link>
                    </motion.div>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Síguenos</h4>
            <div className="flex space-x-4 justify-center">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="hover:text-blue-500 dark:hover:text-blue-400"
              >
                Twitter
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="hover:text-blue-500 dark:hover:text-blue-400"
              >
                Instagram
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 w-full max-w-6xl">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} SportConnection. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
