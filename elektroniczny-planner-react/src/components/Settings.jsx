// src/components/Settings.jsx
import React, { useState } from 'react';
import Card from './Card';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/apiService';

function Settings() {
  const { user, token } = useAuth(); // Pobieramy dane użytkownika i token
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState(''); // Komunikat sukcesu/błędu
  const [error, setError] = useState(''); // Komunikat błędu

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Nowe hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Nowe hasła nie pasują do siebie.');
      return;
    }

    try {
      // Wysłanie żądania do backendu o zmianę hasła
      // Będziemy potrzebować nowego endpointu na backendzie!
      await authService.changePassword(currentPassword, newPassword, token);
      setMessage('Hasło zostało zmienione pomyślnie!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Błąd zmiany hasła:', err);
      setError(err.message || 'Nie udało się zmienić hasła. Spróbuj ponownie.');
    }
  };

  return (
    <Card title="Ustawienia Użytkownika" isCollapsible defaultCollapsed={false}>
      <h3>Informacje o koncie</h3>
      <p>Adres e-mail: <strong>{user ? user.email : 'N/A'}</strong></p>
      {/* Można tu dodać więcej informacji o użytkowniku */}

      <h3>Zmień hasło</h3>
      <form onSubmit={handleChangePassword}>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="form-group">
          <label htmlFor="currentPassword">Obecne hasło:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nowe hasło:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Potwierdź nowe hasło:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">Zmień hasło</button>
      </form>
    </Card>
  );
}

export default Settings;