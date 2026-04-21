// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage'; // Nowy komponent strony logowania
import DashboardPage from './pages/DashboardPage'; // Nowy komponent strony dashboardu
import WeeklyMealPlanPage from './pages/WeeklyMealPlanPage'; // Nowa strona

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} /> {/* DashboardPage będzie zawierał Dashboard */}
        <Route path="/weekly-meal-plan" element={<WeeklyMealPlanPage />} /> {/* Nowa trasa */}
        {/* Tutaj dodamy więcej tras dla poszczególnych sekcji dashboardu, jeśli będą miały osobne URL-e */}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;