import React, { useState, useEffect } from 'react';
import { getAllLocations } from '../../../services/locationService';
import { getAllSports } from '../../../services/sportService';
import { useNavigate } from 'react-router-dom';

export function RegisterPartTwo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [ubicaciones, setUbicaciones] = useState([]);
  const [deportes, setDeportes] = useState([]);

  useEffect(() => {
    getAllLocations().then(data => setUbicaciones(data));
  }, []);

  useEffect(() => {
  getAllSports().then(data => setDeportes(data));
}, []);

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
                value="agent"
                checked={formData.userType === 'agent'}
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Apellido"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    placeholder="Fecha de Nacimiento"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Altura"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Peso"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  
                  <select
                    id="sport_id"
                    name="sport_id"
                    value={formData.sport_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-black dark:text-white"
                  >
                    <option value="" disabled>Seleccionar un deporte</option>
                    {deportes.map(deporte => (
                      <option key={deporte.id} value={deporte.id}>
                        {deporte.name}
                      </option>
                    ))}
                  </select>
                  <select
                    id="location_id"
                    name="location_id"
                    value={formData.location_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-black dark:text-white"
                  >
                    <option value="" disabled>Seleccionar una ubicación</option>
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion.id} value={ubicacion.id}>
                        {ubicacion.country} - {ubicacion.province} - {ubicacion.city}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Nro de Teléfono"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="ig_user"
                    value={formData.ig_user}
                    onChange={handleChange}
                    placeholder="Usuario de Instagram"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="x_user"
                    value={formData.x_user}
                    onChange={handleChange}
                    placeholder="Usuario de Twitter"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  
                </div>
              )}
              {formData.userType === 'agent' && (
                <div className="space-y-4">
                   <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Apellido"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <select
                    id="location_id"
                    name="location_id"
                    value={formData.location_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-black dark:text-white"
                  >
                    <option value="" disabled>Seleccionar una ubicación</option>
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion.id} value={ubicacion.id}>
                        {ubicacion.country} - {ubicacion.province} - {ubicacion.city}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Nro de Teléfono"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="ig_user"
                    value={formData.ig_user}
                    onChange={handleChange}
                    placeholder="Usuario de Instagram"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="x_user"
                    value={formData.x_user}
                    onChange={handleChange}
                    placeholder="Usuario de Twitter"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="agency"
                    value={formData.agency || ''}
                    onChange={handleChange}
                    placeholder="Empresa"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  
                </div>
              )}
              {formData.userType === 'team' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Nombre del equipo"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="job"
                    value={formData.job}
                    onChange={handleChange}
                    placeholder="Nombre del representante del equipo"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <select
                    id="sport_id"
                    name="sport_id"
                    value={formData.sport_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-black dark:text-white"
                  >
                    <option value="" disabled>Seleccionar un deporte</option>
                    {deportes.map(deporte => (
                      <option key={deporte.id} value={deporte.id}>
                        {deporte.name}
                      </option>
                    ))}
                  </select>
                  <select
                    id="location_id"
                    name="location_id"
                    value={formData.location_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-black dark:text-white"
                  >
                    <option value="" disabled>Seleccionar una ubicación</option>
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion.id} value={ubicacion.id}>
                        {ubicacion.country} - {ubicacion.province} - {ubicacion.city}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Nro de Teléfono"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="ig_user"
                    value={formData.ig_user}
                    onChange={handleChange}
                    placeholder="Usuario de Instagram"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-700"
                  />
                  <input
                    type="text"
                    name="x_user"
                    value={formData.x_user}
                    onChange={handleChange}
                    placeholder="Usuario de Twitter"
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
