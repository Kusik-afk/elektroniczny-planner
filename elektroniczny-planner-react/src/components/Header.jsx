// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Używamy Link z React Router do nawigacji

function Header() {
  return (
    <header>
      <img src="/img/logo-planera.png" alt="Logo Elektronicznego Planera" width="50" />
      <h1>Elektroniczny Planner</h1>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/login" className="button button-logout">Wyloguj</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;