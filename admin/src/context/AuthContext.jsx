import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on page load
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (username, password) => {
    // Compare with environment variables
    const correctUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (username === correctUsername && password === correctPassword) {
      // Create a simple token with timestamp (not for real security, just for session tracking)
      const token = btoa(`${username}:${Date.now()}`);
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
