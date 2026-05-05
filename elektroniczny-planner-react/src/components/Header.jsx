// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // ✅ USUWA token i user z localStorage
    navigate('/login'); // ✅ przekierowanie
  };

  return (
    <header>
      <img
        src="/img/logo-planera.png"
        alt="Logo Elektronicznego Planera"
        width="50"
      />
      <h1>Elektroniczny Planner</h1>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="button button-logout"
            >
              Wyloguj
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;