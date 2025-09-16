import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Datos para enviar al backend:', formData);
    navigate('/RegistroTipoDeUsuario');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  return (
    <section className='m-10'>
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-white">Crear Cuenta</h2>
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
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
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 mb-4 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-3xl text-gray-700 hover:bg-gray-100"
          >
            <FaGoogle />
            Registrarse con Google
          </button>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-700 "
          >
            Siguiente
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-600 dark:text-gray-400">¿Ya tienes una cuenta? </span>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => navigate('/InicioSesion')}
            >
              Inicia Sesión
            </button>
          </div>
        </form>
      </div>

    </section>

  );

}
