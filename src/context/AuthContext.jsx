import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

    const register = async (userData) => {
    try {
      setLoading(true);
      setAuthError(null);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      setAuthError(error.message || 'Error en el registro');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async (profileData) => {
    try {
      setLoading(true);
      setAuthError(null);
      const response = await authService.completeProfile(profileData);
      
      setUser(prevUser => ({
        ...prevUser,
        ...response.user
      }));
      
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...response.user
      }));
      
      return response;
    } catch (error) {
      setAuthError(error.message || 'Error al completar el perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const login = async (credentials) => {
    try {
      setLoading(true);
      setAuthError(null);

      let response;
      
      // Detectar si es login con Google o credenciales normales
      if (credentials.googleToken) {
        // Login con Google
        response = await authService.googleLogin(credentials.googleToken);
      } else {
        // Login normal con email/password
        response = await authService.login(credentials);
      }

      // Si requiere completar perfil, NO autenticar todavía
      if (response.requiresProfile) {
        // Guardar temporalmente en sessionStorage
        sessionStorage.setItem('registrationData', JSON.stringify({
          email: response.user?.email,
          token: response.token,
          userId: response.user?.id || response.userId
        }));
        navigate('/RegistroTipoDeUsuario');
        return response;
      }

      // Solo autenticar si el perfil está completo
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      setIsAuthenticated(true);

      navigate('/');
      
      return response;
    } catch (error) {
      console.error('Login error in AuthContext:', error.message);
      setAuthError(error.message || 'Credenciales Invalidas');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para autenticar con token existente (para registro completado)
  const authenticateWithToken = async (token, userData) => {
    try {
      setLoading(true);
      setAuthError(null);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      navigate('/');
      return { token, user: userData };
    } catch (error) {
      console.error('Token authentication error:', error.message);
      setAuthError(error.message || 'Error en la autenticación');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (token) => {
    try {
      setLoading(true);
      setAuthError(null);

      const response = await authService.googleLogin(token);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      setIsAuthenticated(true);

      navigate('/');
      return response;
    } catch (error) {
      setAuthError(error.message || 'Error en el inicio de sesión con Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setAuthError(null);

      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      setAuthError(error.message || 'Error al actualizar el perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMyProfile = async () => {
    try {
      setLoading(true);
      setAuthError(null);

      const profileData = await authService.getMyProfile();

      // Actualizar el estado del usuario con los datos del perfil
      setUser(prevUser => ({
        ...prevUser,
        ...profileData
      }));

      // Actualizar localStorage
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...profileData
      }));

      return profileData;
    } catch (error) {
      setAuthError(error.message || 'Error al obtener el perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

    const deleteProfile = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await authService.deleteMyProfile();
      logout(); // Limpia el estado y redirige
    } catch (error) {
      setAuthError(error.message || 'Error al eliminar el perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    navigate('/');
  };

  const clearError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    authError,
    clearError,
    googleLogin,
    updateProfile,
    getMyProfile,
    register,         
    completeProfile, 
    deleteProfile,
    authenticateWithToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};