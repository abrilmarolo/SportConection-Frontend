import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
export function LogIn() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, authError, clearError } = useAuth();

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError('');
    clearError();

    try {
      await login(credentials);
      console.log('Login exitoso en componente');
      // La navegación se maneja en el AuthContext
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }

  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) {
      setError('');
      clearError();
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError('');
      clearError();
      
      // El token viene en credentialResponse.credential
      await login({ googleToken: credentialResponse.credential });
      console.log('Google login exitoso');
    } catch (error) {
      console.error('Error en Google login:', error);
      setError(error.message || 'Error al iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al iniciar sesión con Google. Intenta nuevamente.');
  };

  return (
    <section className='m-10'>
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-white">
          Iniciar Sesión
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center flex items-center justify-center gap-2">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 mb-2">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-3 top-11 text-gray-500"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`w-full py-2 rounded-3xl text-white ${isLoading ? 'bg-blue-400 cursor-pointer' : 'bg-blue-700 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer'}`}
          >
            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </motion.button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                O continúa con
              </span>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="signin_with"
              shape="pill"
              size="large"
              width="100%"
            />
          </div>

          <div className="text-center mt-4">
            <span className="text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
            </span>
            <motion.button
              type="button"
              onClick={() => navigate('/Registro')}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600"
            >
              Regístrate
            </motion.button>
          </div>
        </form>
      </div>

      
    </section>
  );
}