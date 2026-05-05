// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService'; // Importujemy authService
import { useAuth } from '../context/AuthContext'; // Importujemy useAuth

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Pobieramy funkcję login z kontekstu, aby zalogować po rejestracji

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    // Walidacja e-maila
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Proszę podać poprawny adres e-mail.');
      isValid = false;
    }

    // Walidacja hasła
    if (password.length < 6) {
      setPasswordError('Hasło musi mieć co najmniej 6 znaków.');
      isValid = false;
    }

    // Walidacja potwierdzenia hasła
    if (password !== confirmPassword) {
      setConfirmPasswordError('Hasła nie pasują do siebie.');
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await authService.register(email, password); // Wywołujemy API rejestracji
        console.log('Zarejestrowano pomyślnie:', response);
        // Po udanej rejestracji, automatycznie logujemy użytkownika
        login(response.token, { id: response.id, email: response.email });
        navigate('/dashboard'); // Przekierowanie na dashboard
      } catch (error) {
        setGeneralError(error.message || 'Błąd rejestracji. Spróbuj ponownie.');
        console.error('Błąd rejestracji:', error);
      }
    }
  };

  return (
    <main>
      <section className="card" id="register-form-container">
        <h2>Rejestracja w Elektronicznym Plannerze</h2>
        <form onSubmit={handleSubmit}>
          {generalError && <p className="error-message" style={{ textAlign: 'center' }}>{generalError}</p>}
          <div className="form-group">
            <label htmlFor="email">Adres e-mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'input-error' : ''}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'input-error' : ''}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Potwierdź hasło:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={confirmPasswordError ? 'input-error' : ''}
              required
            />
            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
          </div>

          <button type="submit" className="button">Zarejestruj się</button>
        </form>
        <p>Masz już konto? <Link to="/login">Zaloguj się tutaj</Link>.</p>
      </section>
    </main>
  );
}

export default RegisterForm;