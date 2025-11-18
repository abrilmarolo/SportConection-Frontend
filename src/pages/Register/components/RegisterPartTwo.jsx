import React, { useState, useEffect } from 'react';
import { locationService } from '../../../services/locationService';
import { sportService } from '../../../services/sportService';
import { authService } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export function RegisterPartTwo() {
  const navigate = useNavigate();
  const { authenticateWithToken } = useAuth();
  const [formData, setFormData] = useState({
    // Campos para athlete
    name: '',
    last_name: '',
    birthdate: '',
    height: '',
    weight: '',
    location_id: '',
    sport_id: '',
    phone_number: '',
    ig_user: '',
    x_user: '',
    description: '',
    agency: '',
    job: '',
    profile_type: ''
  });
  const [ubicaciones, setUbicaciones] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    // Recuperar datos de registro de la pantalla anterior
    const storedData = sessionStorage.getItem('registrationData');
    if (storedData) {
      setRegistrationData(JSON.parse(storedData));
    } else {
      // Si no hay datos, redirigir al registro
      navigate('/Registro');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getAllLocations();
        setUbicaciones(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setUbicaciones([]);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const data = await sportService.getAllSports();
        setDeportes(data);
      } catch (error) {
        console.error('Error fetching sports:', error);
        setDeportes([]); // Set empty array on error
      }
    };

    fetchSports();
  }, []);

  // Mapear tipos de perfil del frontend al backend
  const mapProfileType = (frontendType) => {
    const typeMap = {
      'Deportista': 'athlete',
      'Agente': 'agent', 
      'Equipo': 'team'
    };
    return typeMap[frontendType] || frontendType.toLowerCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!registrationData) {
      setError('Datos de registro no encontrados. Vuelve a registrarte.');
      navigate('/Registro');
      return;
    }

    // Validar campos requeridos según el tipo de usuario
    if (!formData.profile_type) {
      setError('Por favor, selecciona un tipo de usuario');
      return;
    }

    try {
      setLoading(true);

      // Mapear el tipo de perfil
      const mappedProfileType = mapProfileType(formData.profile_type);
      
      // Preparar los datos según el formato del backend
      // El backend espera: { profileType, ...profileData }
      const { profile_type, ...otherFields } = formData;
      
      // Limpiar campos vacíos y convertir IDs a números
      const cleanProfileData = Object.fromEntries(
        Object.entries(otherFields)
          .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
          .map(([key, value]) => {
            // Convertir location_id y sport_id a números
            if ((key === 'location_id' || key === 'sport_id') && value) {
              return [key, parseInt(value)];
            }
            // Convertir height y weight a números
            if ((key === 'height' || key === 'weight') && value) {
              return [key, parseFloat(value)];
            }
            return [key, value];
          })
      );

      const payload = {
        profileType: mappedProfileType,
        ...cleanProfileData
      };

      // Establecer el token en localStorage temporalmente para la petición
      localStorage.setItem('token', registrationData.token);

      console.log('Tipo original:', formData.profile_type);
      console.log('Tipo mapeado:', mappedProfileType);
      console.log('Payload enviado:', payload);

      // Llamar al servicio completeProfile
      const response = await authService.completeProfile(payload);
      
      console.log('Perfil completado exitosamente:', response);

      // Si es exitoso, autenticar con el token existente
      await authenticateWithToken(registrationData.token, {
        id: registrationData.userId,
        email: registrationData.email,
        profile_type: mapProfileType(formData.profile_type)
      });

      // Limpiar datos temporales
      sessionStorage.removeItem('registrationData');

    } catch (error) {
      console.error('Error al completar perfil:', error);
      setError(error.message || 'Error al completar el registro');
      // Limpiar token si hay error
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/Registro');
  };

  return (
    <section className='m-10'>
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-white">Tipo de Usuario</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Completando registro...
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-center gap-3 items-center">
            <label className="block cursor-pointer text-center">
              <input
                type="radio"
                name="profile_type"
                value="Deportista"
                checked={formData.profile_type === 'Deportista'}
                onChange={handleChange}
              />
              <span className="text-gray-700 dark:text-gray-200 mx-2">Deportista</span>
            </label>

            <label className="block cursor-pointer text-center">
              <input
                type="radio"
                name="profile_type"
                value="Agente"
                checked={formData.profile_type === 'Agente'}
                onChange={handleChange}

              />
              <span className="text-gray-700 dark:text-gray-200 mx-2">Representante</span>
            </label>

            <label className="block cursor-pointer text-center">
              <input
                type="radio"
                name="profile_type"
                value="Equipo"
                checked={formData.profile_type === 'Equipo'}
                onChange={handleChange}

              />
              <span className="text-gray-700 dark:text-gray-200 mx-2">Equipo</span>
            </label>
          </div>

          {formData.profile_type && (
            <div className="mt-4">
              {/* Campos específicos según el tipo de usuario */}
              {formData.profile_type === 'Deportista' && (
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
              {formData.profile_type === 'Agente' && (
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
              {formData.profile_type === 'Equipo' && (
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
              disabled={loading}
              className="w-1/2 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}