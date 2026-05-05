// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { logout, isAuthenticated } = useAuth(); // Pobieramy isAuthenticated
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // USUWA token i user z localStorage
    navigate('/login'); // przekierowanie
  };

  return (
    <header>
      <img
        src="/img/logo-planera.png"
        alt="Logo Elektronicznego Plannera"
        width="50"
      />
      <h1>Elektroniczny Planner</h1>
      <nav>
        <ul>
          {/* Wyświetlamy linki tylko, jeśli użytkownik jest zalogowany */}
          {isAuthenticated && (
            <>
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
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;