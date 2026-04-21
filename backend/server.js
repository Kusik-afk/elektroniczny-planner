require('dotenv').config(); // Ładuje zmienne środowiskowe z pliku .env
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Pozwala na żądania z różnych domen (np. z naszego frontendu React)
app.use(express.json()); // Umożliwia parsowanie danych JSON z ciała żądań

// Import tras
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const mealRoutes = require('./routes/mealRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const financeRoutes = require('./routes/financeRoutes');

// Użycie tras
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/finance', financeRoutes);

// Prosta trasa testowa
app.get('/', (req, res) => {
    res.send('API dla Elektronicznego Plannera działa!');
});

// Obsługa błędów 404 (Not Found)
app.use((req, res, next) => {
    res.status(404).json({ message: `Nie znaleziono zasobu: ${req.originalUrl}` });
});

// Globalny handler błędów (musi mieć 4 argumenty)
app.use((err, req, res, next) => {
    console.error(err.stack); // Logujemy błąd na konsoli serwera
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Wystąpił wewnętrzny błąd serwera',
        // W trybie deweloperskim możesz pokazać stack trace:
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});