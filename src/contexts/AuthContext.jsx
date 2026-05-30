import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setTokens, clearTokens } from '../Api/api.service';

const AuthContext = createContext(null);

const normalizeRole = (role) => {
  const map = {
    'Super Admin': 'superadmin',
    'Lab Admin': 'admin',
    'Admin': 'admin',
    'Storekeeper': 'storekeeper',
    'Student': 'student',
  };
  return map[role] || (role || 'student').toLowerCase().replace(' ', '');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth check timeout')), 5000)
        );
        const response = await Promise.race([authAPI.profile(), timeoutPromise]);
        // Handle both flat {id, role, ...} and nested {user: {id, role, ...}} response
        const profileData = response.data?.user || response.data;
        const normalizedUser = {
          ...profileData,
          role: normalizeRole(profileData?.role),
        };
        setUser(normalizedUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        clearTokens();
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { tokens, user } = response.data;
      
      const normalizedUser = {
        ...user,
        role: normalizeRole(user?.role),
      };

      setTokens(tokens.access, tokens.refresh);
      setUser(normalizedUser);
      
      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      const { tokens, user } = response.data;
      
      const normalizedUser = {
        ...user,
        role: normalizeRole(user?.role),
      };

      setTokens(tokens.access, tokens.refresh);
      setUser(normalizedUser);
      
      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    clearTokens();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
