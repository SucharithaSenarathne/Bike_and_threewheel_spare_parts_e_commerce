import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin');
    
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(adminStatus === 'true');
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    setIsLoading(false);
  }, []);

  const login = ({ token, isAdmin }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    setIsAuthenticated(true);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
