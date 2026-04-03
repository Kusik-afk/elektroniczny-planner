// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      {/* Header i Footer mogą być tutaj, jeśli są wspólne dla wszystkich stron,
          lub wewnątrz komponentów stron, jeśli mają być specyficzne.
          Na razie umieścimy je tutaj, żeby były na każdej stronie. */}
      <Header />

      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* Używamy * (gwiazdki), aby dopasować wszystkie podtrasy dashboardu */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;