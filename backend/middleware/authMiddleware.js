const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Do obsługi błędów w funkcjach asynchronicznych

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Sprawdzamy, czy nagłówek Authorization istnieje i zaczyna się od 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Pobieramy token z nagłówka
            token = req.headers.authorization.split(' ')[1];

            // Weryfikujemy token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tutaj w przyszłości pobieralibyśmy użytkownika z bazy danych
            // Na razie symulujemy, że mamy user ID z tokena
            req.user = { id: decoded.id, email: decoded.email }; // Dodajemy dane użytkownika do obiektu żądania

            next(); // Przekazujemy kontrolę do następnego middleware/kontrolera
        } catch (error) {
            console.error(error);
            res.status(401); // Unauthorized
            throw new Error('Brak autoryzacji, token nieudany');
        }
    }

    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Brak autoryzacji, brak tokena');
    }
});

module.exports = { protect };