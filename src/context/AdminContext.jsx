import React, { createContext, useContext, useState } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState({
    users: [],
    sports: [],
    locations: [],
    statistics: null
  });

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Users Management
  const getAllUsers = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const users = await adminService.getAllUsers();
      setAdminData(prev => ({ ...prev, users }));
      return users;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sports Management
  const getAllSports = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const sports = await adminService.getAllSports();
      setAdminData(prev => ({ ...prev, sports }));
      return sports;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

    const createUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await adminService.createUser(userData);
      setAdminData(prev => ({
        ...prev,
        users: [...prev.users, newUser]
      }));
      return newUser;
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await adminService.updateUser(id, updates);
      setAdminData(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === id ? updatedUser : user
        )
      }));
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteUser(id);
      setAdminData(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== id)
      }));
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await adminService.changeUserRole(id, role);
      setAdminData(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === id ? updatedUser : user
        )
      }));
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Error al cambiar rol de usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSport = async (sportData) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const newSport = await adminService.createSport(sportData);
      setAdminData(prev => ({
        ...prev,
        sports: [...prev.sports, newSport]
      }));
      return newSport;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSport = async (id, updates) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const updatedSport = await adminService.updateSport(id, updates);
      setAdminData(prev => ({
        ...prev,
        sports: prev.sports.map(sport => 
          sport.id === id ? updatedSport : sport
        )
      }));
      return updatedSport;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSport = async (id) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      await adminService.deleteSport(id);
      setAdminData(prev => ({
        ...prev,
        sports: prev.sports.filter(sport => sport.id !== id)
      }));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Locations Management
  const getAllLocations = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const locations = await adminService.getAllLocations();
      setAdminData(prev => ({ ...prev, locations }));
      return locations;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (locationData) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const newLocation = await adminService.createLocation(locationData);
      setAdminData(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation]
      }));
      return newLocation;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const clearError = () => setError(null);

  const value = {
    isAdmin,
    loading,
    error,
    adminData,
    clearError,
    getAllUsers,
    getAllSports,
    createSport,
    updateSport,
    deleteSport,
    getAllLocations,
    createLocation,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de un AdminProvider');
  }
  return context;
};
