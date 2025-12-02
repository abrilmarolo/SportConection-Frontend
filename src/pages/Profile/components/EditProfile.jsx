import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { locationService } from '../../../services/locationService';
import { sportService } from '../../../services/sportService';
import { profilePhotoService } from '../../../services/profilePhotoService';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileType, setProfileType] = useState('');
  const [profile, setProfile] = useState(null);
  const [locations, setLocations] = useState([]);
  const [sports, setSports] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await authService.getMyProfile();
        setProfileType(data.profileType);
        setProfile(data.profile || {});
        const locs = await locationService.getAllLocations();
        setLocations(locs || []);
        const spts = await sportService.getAllSports();
        setSports(spts || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }
    try {
      setError('');
      setSaving(true);
      await profilePhotoService.uploadPhoto(file);
      // recargar perfil desde backend para obtener nueva foto y valores normalizados
      const data = await authService.getMyProfile();
      setProfile(data.profile || {});
      
      toast.success('¡Foto subida correctamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Disparar evento personalizado para actualizar la navbar
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated'));
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Error al subir foto');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setSaving(true);

      // Construir payload limpio para evitar enviar objetos anidados
      const profileUpdates = {};

      // Campos permitidos simples (excluir last_name para teams)
      const simpleFields = ['name', 'description', 'phone_number', 'ig_user', 'x_user', 'agency', 'job', 'birthdate'];
      if (profileType !== 'team') simpleFields.splice(1, 0, 'last_name'); // insertar last_name después de name para tipos que no son team
      simpleFields.forEach((f) => {
        if (profile?.[f] !== undefined && profile?.[f] !== null && profile?.[f] !== '') {
          profileUpdates[f] = profile[f];
        }
      });

      // Campos numéricos
      if (profile?.height !== undefined && profile.height !== '') profileUpdates.height = Number(profile.height);
      if (profile?.weight !== undefined && profile.weight !== '') profileUpdates.weight = Number(profile.weight);

      // location_id: puede venir como profile.location_id o profile.location.id
      const locationId = profile.location_id || profile.location?.id;
      if (locationId) profileUpdates.location_id = Number(locationId);

      // sport_id: puede venir como profile.sport_id o profile.sport.id
      const sportId = profile.sport_id || profile.sport?.id;
      if (sportId) profileUpdates.sport_id = Number(sportId);

      // Log payload para debug (ver consola)
      console.log('Profile update payload:', profileUpdates);

      // Enviar solo profileUpdates (backend espera { profileUpdates } o similar)
      await authService.updateProfile({ profileUpdates });

      // refrescar perfil y UI
      const data = await authService.getMyProfile();
      setProfile(data.profile || {});
      
      toast.success('¡Perfil actualizado correctamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Disparar evento personalizado para actualizar la navbar
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated'));

      // redirigir al perfil (ajusta la ruta si tu ruta real es distinta)
      setTimeout(() => navigate('/Perfil'), 800);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.message || 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <section className="m-10">
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-white">Editar Perfil</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos comunes */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Nombre</label>
            <input name="name" value={profile?.name || ''} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          {profileType !== 'team' && (
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Apellido</label>
              <input name="last_name" value={profile?.last_name || ''} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          )}

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Descripción</label>
            <textarea name="description" value={profile?.description || ''} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          {/* Campos por tipo */}
          {profileType === 'athlete' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-2">Altura (cm)</label>
                  <input name="height" value={profile?.height || ''} onChange={handleChange} type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-2">Peso (kg)</label>
                  <input name="weight" value={profile?.weight || ''} onChange={handleChange} type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2">Fecha de nacimiento</label>
                <input name="birthdate" value={profile?.birthdate || ''} onChange={handleChange} type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </>
          )}

          {profileType === 'agent' && (
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Agencia</label>
              <input name="agency" value={profile?.agency || ''} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          )}

          {profileType === 'team' && (
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Cargo / Rol</label>
              <input name="job" value={profile?.job || ''} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          )}

          {/* Contacto y redes */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Teléfono</label>
            <input name="phone_number" value={profile?.phone_number || ''} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Instagram</label>
              <input name="ig_user" value={profile?.ig_user || ''} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">X / Twitter</label>
              <input name="x_user" value={profile?.x_user || ''} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          {/* Selects de sport y location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Deporte</label>
              <select name="sport_id" value={profile?.sport_id || profile?.sport?.id || ''} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="">Seleccione</option>
                {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Ubicación</label>
              <select name="location_id" value={profile?.location_id || profile?.location?.id || ''} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="">Seleccione</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{[l.city, l.province, l.country].filter(Boolean).join(', ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Foto de perfil</label>
            <div className="flex gap-2 items-center">
              <motion.button type="button" onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded-lg cursor-pointer"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}>
                Subir foto
              </motion.button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{profile?.photo_url ? 'Foto disponible' : 'Sin foto'}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <motion.button type="button" onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 cursor-pointer"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}>
              Cancelar
            </motion.button>
            <motion.button type="submit" disabled={saving} 
              className={`px-4 py-2 rounded-lg text-white ${saving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 cursor-pointer'}`}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
}
