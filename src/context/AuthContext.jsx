import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('chargeShareUser');
    const storedToken = localStorage.getItem('chargeShareToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error restoring user from storage:', err);
        localStorage.removeItem('chargeShareUser');
        localStorage.removeItem('chargeShareToken');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('chargeShareUser', JSON.stringify(userData));
      localStorage.setItem('chargeShareToken', userData.token);
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data && res.data.success) {
      const data = res.data.data;
      setUser(data);
      localStorage.setItem('chargeShareUser', JSON.stringify(data));
      localStorage.setItem('chargeShareToken', data.token);
      return data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Quick Demo Login helper (Admin, Seller, User)
  const quickLogin = async (role) => {
    let creds = { email: '', password: '' };
    if (role === 'admin') {
      creds = { email: 'admin@chargeshare.com', password: 'admin123' };
    } else if (role === 'seller') {
      creds = { email: 'rajesh.seller@chargeshare.com', password: 'seller123' };
    } else {
      creds = { email: 'arun.user@chargeshare.com', password: 'user123' };
    }
    return await login(creds.email, creds.password);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('chargeShareUser');
    localStorage.removeItem('chargeShareToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        quickLogin,
        logout,
        isAuthenticated: !!user,
        role: user ? user.role : null,
      }}
    >
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
