const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Prosta baza danych użytkowników w pamięci serwera
const users = []; // Będzie przechowywać { id, email, passwordHash }

// Funkcja pomocnicza do generowania tokena JWT
const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token wygasa po 1 godzinie
    });
};

// @desc    Rejestracja nowego użytkownika
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Proszę podać adres e-mail i hasło');
    }

    // Sprawdzamy, czy użytkownik już istnieje
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        res.status(400);
        throw new Error('Użytkownik o podanym adresie e-mail już istnieje');
    }

    // Hashujemy hasło
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tworzymy nowego użytkownika i dodajemy do "bazy danych"
    const newUser = {
        id: users.length + 1, // Proste ID
        email,
        passwordHash: hashedPassword,
    };
    users.push(newUser);

    // Generujemy token JWT
    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        token,
    });
});

// @desc    Logowanie użytkownika
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Sprawdzamy, czy użytkownik istnieje
    const user = users.find(u => u.email === email);
    if (!user) {
        res.status(400);
        throw new Error('Nieprawidłowy adres e-mail lub hasło');
    }

    // Porównujemy hasło
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        res.status(400);
        throw new Error('Nieprawidłowy adres e-mail lub hasło');
    }

    // Generujemy token JWT
    const token = generateToken(user.id, user.email);

    res.json({
        id: user.id,
        email: user.email,
        token,
    });
});

module.exports = {
    registerUser,
    loginUser,
};