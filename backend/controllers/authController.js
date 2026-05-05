const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importujemy model użytkownika

// Funkcja pomocnicza do generowania tokena JWT
const generateToken = (id, email) => {
    // Dodaj ten console.log, aby sprawdzić, czy SECRET jest dostępny
    console.log("DEBUG: JWT_SECRET:", process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET nie jest zdefiniowany w zmiennych środowiskowych!");
    }
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

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Pobierz użytkownika z bazy danych (req.user.id pochodzi z middleware 'protect')
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('Użytkownik nie znaleziony');
    }

    // Sprawdź, czy obecne hasło jest poprawne
    if (!(await user.matchPassword(currentPassword))) {
        res.status(401);
        throw new Error('Obecne hasło jest nieprawidłowe');
    }

    // Walidacja nowego hasła
    if (!newPassword || newPassword.length < 6) {
        res.status(400);
        throw new Error('Nowe hasło musi mieć co najmniej 6 znaków');
    }

    // Zmień hasło (middleware 'pre save' w modelu User zahashuje je)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Hasło zostało zmienione pomyślnie' });
});

module.exports = {
    registerUser,
    loginUser,
    changePassword
};