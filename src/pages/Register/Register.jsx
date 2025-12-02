import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      
      // Llamar al servicio de registro
      const response = await authService.register({
        email: formData.email,
        password: formData.password
      });

      console.log('Registro exitoso:', response);

      // Si el registro es exitoso, guardar datos temporalmente y navegar
      // Guardar los datos en sessionStorage para usar en la siguiente pantalla
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: formData.email,
        password: formData.password,
        token: response.token,
        userId: response.userId || response.user_id
      }));

      // Navegar a la pantalla de selección de perfil
      navigate('/RegistroTipoDeUsuario');

    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');

      // Llamar al servicio de Google login
      const response = await authService.googleLogin(credentialResponse.credential);

      console.log('Registro con Google exitoso:', response);

      // Guardar token y datos del usuario
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: response.user.email,
        token: response.token,
        userId: response.user.id
      }));

      // Si requiere completar perfil, navegar a selección de tipo de usuario
      if (response.requiresProfile) {
        navigate('/RegistroTipoDeUsuario');
      } else {
        // Si ya tiene perfil completo, autenticar
        await login({ googleToken: credentialResponse.credential });
      }

    } catch (error) {
      console.error('Error en registro con Google:', error);
      setError(error.message || 'Error al registrar con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al registrar con Google. Intenta nuevamente.');
  };

  return (
    <section className='m-10'>
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-white">Crear Cuenta</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-4 ">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-2">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 mb-2">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-3 top-11 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-200 mb-2">Confirmar Contraseña</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-3 top-11 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="w-full py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Siguiente'}
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
              text="signup_with"
              shape="pill"
              size="large"
              width="100%"
            />
          </div>

          <div className="text-center mt-4">
            <span className="text-gray-600 dark:text-gray-400">¿Ya tienes una cuenta? </span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => navigate('/InicioSesion')}
            >
              Inicia Sesión
            </motion.button>
          </div>
        </form>
      </div>

    </section>

  );

}

