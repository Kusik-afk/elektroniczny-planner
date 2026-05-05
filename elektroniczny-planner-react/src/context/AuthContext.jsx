// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Tworzymy kontekst uwierzytelniania
const AuthContext = createContext(null);

// Komponent Providera, który będzie dostarczał stan uwierzytelnienia
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Tutaj będziemy przechowywać dane użytkownika (np. email, id)
  const [token, setToken] = useState(null); // Tutaj będziemy przechowywać token JW
  const [authLoading, setAuthLoading] = useState(true);

  // Efekt do ładowania tokena i danych użytkownika z localStorage przy starcie aplikacji
  useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  }

  setAuthLoading(false); // ✅ KLUCZOWE
}, []);

  // Funkcja do logowania
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken); // Zapisujemy token w localStorage
    localStorage.setItem('user', JSON.stringify(userData)); // Zapisujemy dane użytkownika
  };

  // Funkcja do wylogowania
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Usuwamy token z localStorage
    localStorage.removeItem('user');
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    authLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook do łatwego używania kontekstu uwierzytelniania
export const useAuth = () => {
  return useContext(AuthContext);
};