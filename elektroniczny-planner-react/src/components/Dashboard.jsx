// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from './SideMenu';
import Tasks from './Tasks';
import Meals from './Meals';
import Training from './Training';
import Finance from './Finance';
import SummaryCards from './SummaryCards';
import { useAuth } from '../context/AuthContext'; // Importujemy useAuth
import Settings from './Settings';

function Dashboard() {
  const { user } = useAuth(); // Pobieramy dane użytkownika z kontekstu
  const [userName, setUserName] = useState('Użytkowniku');

  useEffect(() => {
    if (user && user.email) {
      // Używamy emaila jako nazwy użytkownika, jeśli dostępne
      setUserName(user.email.split('@')[0]); // Wyciągamy część przed @
    } else {
      setUserName('Gościu'); // Domyślna nazwa, jeśli brak danych
    }
  }, [user]); // Efekt uruchomi się, gdy zmieni się obiekt user

  return (
    <div className="dashboard-layout">
      <SideMenu />
      <main className="main-content">
        <h1 style={{ gridColumn: '1 / -1', marginBottom: 'var(--spacing-lg)' }}>Witaj, {userName}!</h1>
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
          <SummaryCards />
        </div>
        <Routes>
          <Route path="tasks" element={<Tasks />} />
          <Route path="meals" element={<Meals />} />
          <Route path="training" element={<Training />} />
          <Route path="finance" element={<Finance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/" element={
            <>
              <Tasks />
              <Meals />
              <Training />
              <Finance />
            </>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;