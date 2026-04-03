import React, { useState } from "react";
import { useNavigate } from "react-router-dom";//hook do nawigacji programistycznej

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();//inicjalizujemy hook do nawigacji

    const handleSubmit = (event) => {
        event.preventDefault();//zatrzymujemy domyślne wysyłanie formularza

        let isValid = true;

        //Resetujemy błędy
        setEmailError('');
        setPasswordError('');

        //Walidacja e-maila
        if (!email.includes('@') || !email.includes('.')) {
            setEmailError('Proszę podać poprawny adres email.');
            isValid = false;
        }

        //Walidacja hasła
        if (password.length < 6) {
            setPasswordError('Hasło musi mieć co najmniej 6 znaków.');
            isValid = false;
        }

        if (isValid) {
            console.log('Formularz logowania poprawny. Wysyłam dane:', { email, password });
            //tutaj w prawdziwej aplikacji wysłalibyśmy dane do backendu
            alert('Zalogowano pomyślnie (symulacja)!');
            navigate('/dashboard');//przekierowanie na dash board po zalogowaniu
        }
    };

    return (
        <main>
            <section className="card" id="login-form-container">
                <h2>Logowanie do Elektronicznego Planera</h2>
                <form onSubmit={handleSubmit}>
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
                            {passwordError && <p className="error-message">passwordError</p>}
                    </div>

                    <button type="submit" className="button">Zaloguj się</button>
                </form>
                <p>Nie masz konta? <Link to="/register">Zarejestruj się tutaj</Link>.</p>
                <p><Link to="/forgot-password">Zapomniałem hasła</Link></p>
            </section>
        </main>
    );
}

export default LoginForm;