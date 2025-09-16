import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function RegisterPartTwo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: '',
    sport: '',
    position: '',
    company: '',
    specialty: '',
    teamName: '',
    league: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Aquí irá tu lógica de envío al backend
  };

  const handleBack = () => {
    navigate('/Registro');
  };

  return (
     <section className='m-10'>
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-white">Tipo de Usuario</h2>
        <div className="space-y-4">
          <div className="flex justify-center gap-3 items-center">
            <label className="block cursor-pointer text-center">
              <input
                type="radio"
                name="userType"
                value="athlete"
                checked={formData.userType === 'athlete'}
                onChange={handleChange}
              />
              <span className="text-gray-700 dark:text-gray-200 mx-2">Atleta</span>
            </label>

            <label className="block cursor-pointer text-center">
              <input
                type="radio"
                name="userType"
                value="representative"
                checked={formData.userType === 'representative'}
                onChange={handleChange}

              />
              <span className="text-gray-700 dark:text-gray-200 mx-2">Representante</span>
            </label>

            <label className="block cursor-pointer text-center">
              <input
                type="radio"
                name="userType"
                value="team"
                checked={formData.userType === 'team'}
                onChange={handleChange}

              />
              <span className="text-gray-700 dark:text-gray-200 mx-2">Equipo</span>
            </label>
          </div>

          {formData.userType && (
            <div className="mt-4">
              {/* Campos específicos según el tipo de usuario */}
              {formData.userType === 'athlete' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="sport"
                    value={formData.sport || ''}
                    onChange={handleChange}
                    placeholder="Deporte"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleChange}
                    placeholder="Posición"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                </div>
              )}
              {formData.userType === 'representative' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleChange}
                    placeholder="Empresa"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty || ''}
                    onChange={handleChange}
                    placeholder="Especialidad"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                </div>
              )}
              {formData.userType === 'team' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName || ''}
                    onChange={handleChange}
                    placeholder="Nombre del equipo"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="sport"
                    value={formData.sport || ''}
                    onChange={handleChange}
                    placeholder="Deporte"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="league"
                    value={formData.league || ''}
                    onChange={handleChange}
                    placeholder="Liga"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleBack}
              className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-3xl hover:bg-gray-300"
            >
              Atrás
            </button>
            <button
              onClick={handleSubmit}
              className="w-1/2 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-700"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
