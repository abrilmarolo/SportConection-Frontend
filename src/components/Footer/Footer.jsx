import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-8 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 flex justify-center w-full">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-6xl text-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">SportConnection</h3>
            <p className="text-sm">Conectando atletas, representantes y equipos de manera profesional.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/AcercaDeNosotros" className="hover:text-blue-500 dark:hover:text-blue-400">Acerca de</Link>
              </li>
              <li>
                <Link to="/Contacto" className="hover:text-blue-500 dark:hover:text-blue-400">Contacto</Link>
              </li>
              <li>
                <Link to="/Ayuda" className="hover:text-blue-500 dark:hover:text-blue-400">Ayuda</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-blue-500 dark:hover:text-blue-400">Privacidad</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-500 dark:hover:text-blue-400">Términos</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Síguenos</h4>
            <div className="flex space-x-4 justify-center">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="hover:text-blue-500 dark:hover:text-blue-400">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="hover:text-blue-500 dark:hover:text-blue-400">
                LinkedIn
              </a>
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
