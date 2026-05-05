// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Importujemy nową stronę rejestracji
import DashboardPage from './pages/DashboardPage';
import WeeklyMealPlanPage from './pages/WeeklyMealPlanPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> 

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="/weekly-meal-plan" element={<WeeklyMealPlanPage />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;