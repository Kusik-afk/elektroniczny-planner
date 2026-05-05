const asyncHandler = require('express-async-handler');
const Meal = require('../models/Meal'); // Importujemy model posiłku

// @desc    Pobierz wszystkie posiłki dla zalogowanego użytkownika
// @route   GET /api/meals
// @access  Private
const getMeals = asyncHandler(async (req, res) => {
    const { dayOfWeek, sortBy, sortDir, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    // Filtrowanie
    if (dayOfWeek && dayOfWeek !== 'Wszystkie') {
        query.dayOfWeek = dayOfWeek;
    }

    // Sortowanie
    const sort = {};
    if (sortBy) {
        // Specjalna obsługa sortowania po dniu tygodnia
        if (sortBy === 'dayOfWeek') {
            // MongoDB nie sortuje enumów w kolejności, w jakiej są zdefiniowane.
            // Można to zrobić na froncie lub bardziej złożonym zapytaniem w mongo.
            // Na razie sortujemy alfabetycznie dla 'dayOfWeek'
            sort.dayOfWeek = sortDir === 'desc' ? -1 : 1;
            sort.mealType = sortDir === 'desc' ? -1 : 1; // Dodatkowe sortowanie po porze posiłku
        } else {
            sort[sortBy] = sortDir === 'desc' ? -1 : 1;
        }
    } else {
        sort.createdAt = -1; // Domyślne sortowanie
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
    const mealId = req.params.id;
    const { dayOfWeek, mealType, name, calories, ingredients } = req.body;

    let meal = await Meal.findOne({ _id: mealId, userId: req.user.id });

    if (!meal) {
        res.status(404);
        throw new Error('Posiłek nie znaleziono lub nie masz do niego dostępu');
    }

    meal.dayOfWeek = dayOfWeek !== undefined ? dayOfWeek : meal.dayOfWeek;
    meal.mealType = mealType !== undefined ? mealType : meal.mealType;
    meal.name = name !== undefined ? name : meal.name;
    meal.calories = calories !== undefined ? parseInt(calories) : meal.calories;
    meal.ingredients = ingredients !== undefined ? ingredients : meal.ingredients; // Aktualizacja składników

    const updatedMeal = await meal.save();

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