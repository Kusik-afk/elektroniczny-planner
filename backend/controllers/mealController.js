const asyncHandler = require('express-async-handler');
const Meal = require('../models/Meal'); // Importujemy model posiłku

// @desc    Pobierz wszystkie posiłki dla zalogowanego użytkownika z filtrowaniem i sortowaniem
// @route   GET /api/meals
// @access  Private
const getMeals = asyncHandler(async (req, res) => {
    const { dayOfWeek, sortBy, sortDir, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    // Filtrowanie
    if (dayOfWeek && dayOfWeek !== 'Wszystkie') { // 'Wszystkie' oznacza brak filtra
        query.dayOfWeek = dayOfWeek;
    }

    // Sortowanie
    const sort = {};
    if (sortBy) {
        // Specjalna obsługa sortowania po dniu tygodnia
        if (sortBy === 'dayOfWeek') {
            // MongoDB sortuje stringi alfabetycznie. Można to zrobić na froncie,
            // aby zachować kolejność dni tygodnia (Pon, Wt, Śr...).
            // Na backendzie sortujemy alfabetycznie, a następnie po porze posiłku.
            sort.dayOfWeek = sortDir === 'desc' ? -1 : 1;
            sort.mealType = sortDir === 'desc' ? -1 : 1; // Dodatkowe sortowanie po porze posiłku
        } else {
            sort[sortBy] = sortDir === 'desc' ? -1 : 1;
        }
    } else {
        sort.createdAt = -1; // Domyślne sortowanie: najnowsze na górze
    }

    // Paginacja
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const meals = await Meal.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    const totalMeals = await Meal.countDocuments(query);

    res.json({
        meals,
        currentPage: pageNum,
        totalPages: Math.ceil(totalMeals / limitNum),
        totalItems: totalMeals,
    });
});

// @desc    Utwórz nowy posiłek
// @route   POST /api/meals
// @access  Private
const createMeal = asyncHandler(async (req, res) => {
    const { dayOfWeek, mealType, name, calories, ingredients } = req.body;

    // Walidacja podstawowa (Mongoose schema też ma walidację 'required')
    if (!dayOfWeek || !mealType || !name || calories === undefined) { // Sprawdzamy calories !== undefined
        res.status(400);
        throw new Error('Proszę podać dzień, porę, nazwę i kalorie posiłku');
    }

    const meal = await Meal.create({
        userId: req.user.id,
        dayOfWeek,
        mealType,
        name,
        calories: parseInt(calories),
        ingredients,
    });

    res.status(201).json(meal);
});

// @desc    Zaktualizuj posiłek
// @route   PUT /api/meals/:id
// @access  Private
const updateMeal = asyncHandler(async (req, res) => {
    const mealId = req.params.id;
    const { dayOfWeek, mealType, name, calories, ingredients } = req.body;

    let meal = await Meal.findOne({ _id: mealId, userId: req.user.id });

    if (!meal) {
        res.status(404);
        throw new Error('Posiłek nie znaleziono lub nie masz do niego dostępu');
    }

    // Aktualizujemy tylko te pola, które są zdefiniowane w req.body
    if (dayOfWeek !== undefined) meal.dayOfWeek = dayOfWeek;
    if (mealType !== undefined) meal.mealType = mealType;
    if (name !== undefined) meal.name = name;
    if (calories !== undefined) meal.calories = parseInt(calories);
    if (ingredients !== undefined) meal.ingredients = ingredients;

    const updatedMeal = await meal.save();

    res.json(updatedMeal);
});

// @desc    Usuń posiłek
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMeal = asyncHandler(async (req, res) => {
    const mealId = req.params.id;

    const result = await Meal.deleteOne({ _id: mealId, userId: req.user.id });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('Posiłek nie znaleziono lub nie masz do niego dostępu');
    }

    res.status(200).json({ message: 'Posiłek usunięty pomyślnie' });
});

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };