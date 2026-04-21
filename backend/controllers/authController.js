const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importujemy model użytkownika

// Funkcja pomocnicza do generowania tokena JWT
const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @desc    Rejestracja nowego użytkownika
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Walidacja wejściowa (podstawowa, Mongoose też ma walidację)
    if (!email || !password) {
        res.status(400);
        throw new Error('Proszę podać adres e-mail i hasło');
    }

    // Sprawdzamy, czy użytkownik już istnieje
    const userExists = await User.findOne({ email }); // Używamy Mongoose do znalezienia użytkownika
    if (userExists) {
        res.status(400);
        throw new Error('Użytkownik o podanym adresie e-mail już istnieje');
    }

    // Tworzymy nowego użytkownika (hasło zostanie zahashowane przez middleware w modelu User)
    const user = await User.create({
        email,
        password, // Mongoose middleware zahashuje to hasło przed zapisem
    });

    if (user) {
        res.status(201).json({
            id: user._id, // MongoDB generuje _id
            email: user.email,
            token: generateToken(user._id, user.email),
        });
    } else {
        res.status(400);
        throw new Error('Nieprawidłowe dane użytkownika');
    }
});

// @desc    Logowanie użytkownika
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Sprawdzamy, czy użytkownik istnieje
    const user = await User.findOne({ email });

    // Porównujemy hasło za pomocą metody z modelu User
    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user._id,
            email: user.email,
            token: generateToken(user._id, user.email),
        });
    } else {
        res.status(400);
        throw new Error('Nieprawidłowy adres e-mail lub hasło');
    }
});

module.exports = {
    registerUser,
    loginUser,
};