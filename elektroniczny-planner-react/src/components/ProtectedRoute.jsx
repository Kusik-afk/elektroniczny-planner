import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, authLoading } = useAuth();

  // ⏳ Czekamy aż auth się zainicjalizuje
  if (authLoading) {
    return null; // albo spinner / loader
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
