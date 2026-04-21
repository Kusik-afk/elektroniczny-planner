// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from './SideMenu';
import Tasks from './Tasks';
import Meals from './Meals';
import Training from './Training';
import Finance from './Finance';
import SummaryCards from './SummaryCards'; // Importujemy nowy komponent

function Dashboard() {
  const [userName, setUserName] = useState('Użytkowniku');

  useEffect(() => {
    const storedUserName = localStorage.getItem('currentUserName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      localStorage.setItem('currentUserName', 'Gościu');
      setUserName('Gościu');
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <SideMenu />
      <main className="main-content">
        <h1 style={{ gridColumn: '1 / -1', marginBottom: 'var(--spacing-lg)' }}>Witaj, {userName}!</h1>

        {/* Podsumowania na górze dashboardu */}
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <SummaryCards />
        </div>

        <Routes>
          <Route path="tasks" element={<Tasks />} />
          <Route path="meals" element={<Meals />} />
          <Route path="training" element={<Training />} />
          <Route path="finance" element={<Finance />} />
          {/* Domyślna trasa dla dashboardu, jeśli nic nie jest wybrane - wyświetla wszystkie moduły */}
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