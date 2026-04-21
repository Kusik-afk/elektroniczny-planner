const asyncHandler = require('express-async-handler');
const Meal = require('../models/Meal'); // Importujemy model posiłku

// @desc    Pobierz wszystkie posiłki dla zalogowanego użytkownika
// @route   GET /api/meals
// @access  Private
const getMeals = asyncHandler(async (req, res) => {
    const meals = await Meal.find({ userId: req.user.id }); // Znajdujemy posiłki po userId
    res.json(meals);
});

// @desc    Utwórz nowy posiłek
// @route   POST /api/meals
// @access  Private
const createMeal = asyncHandler(async (req, res) => {
    const { dayOfWeek, mealType, name, calories, ingredients } = req.body;

    // Walidacja Mongoose automatycznie sprawdzi 'required' i 'enum'
    const meal = await Meal.create({
        userId: req.user.id,
        dayOfWeek,
        mealType,
        name,
        calories,
        ingredients,
    });

    res.status(201).json(meal);
});

// @desc    Zaktualizuj posiłek
// @route   PUT /api/meals/:id
// @access  Private
const updateMeal = asyncHandler(async (req, res) => {
    const mealId = req.params.id; // ID z URL

    // Znajdujemy posiłek i upewniamy się, że należy do zalogowanego użytkownika
    let meal = await Meal.findOne({ _id: mealId, userId: req.user.id });

    if (!meal) {
        res.status(404);
        throw new Error('Posiłek nie znaleziono lub nie masz do niego dostępu');
    }

    // Aktualizujemy pola
    meal.dayOfWeek = req.body.dayOfWeek || meal.dayOfWeek;
    meal.mealType = req.body.mealType || meal.mealType;
    meal.name = req.body.name || meal.name;
    meal.calories = req.body.calories !== undefined ? req.body.calories : meal.calories;
    meal.ingredients = req.body.ingredients || meal.ingredients;

    const updatedMeal = await meal.save(); // Zapisujemy zmiany

    res.json(updatedMeal);
});

// @desc    Usuń posiłek
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMeal = asyncHandler(async (req, res) => {
    const mealId = req.params.id;

    // Znajdujemy i usuwamy posiłek należący do zalogowanego użytkownika
    const result = await Meal.deleteOne({ _id: mealId, userId: req.user.id });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('Posiłek nie znaleziono lub nie masz do niego dostępu');
    }

    res.status(200).json({ message: 'Posiłek usunięty pomyślnie' });
});

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };