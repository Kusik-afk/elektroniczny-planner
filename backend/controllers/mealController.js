const asyncHandler = require('express-async-handler');

const meals = []; // { id, userId, day, time, name, calories }

const getMeals = asyncHandler(async (req, res) => {
    const userMeals = meals.filter(meal => meal.userId === req.user.id);
    res.json(userMeals);
});

const createMeal = asyncHandler(async (req, res) => {
    const { day, time, name, calories } = req.body;
    if (!day || !time || !name || !calories) {
        res.status(400);
        throw new Error('Proszę podać wszystkie dane posiłku');
    }
    const newMeal = {
        id: meals.length + 1,
        userId: req.user.id,
        day, time, name, calories: parseInt(calories),
    };
    meals.push(newMeal);
    res.status(201).json(newMeal);
});

const updateMeal = asyncHandler(async (req, res) => {
    const mealId = parseInt(req.params.id);
    const { day, time, name, calories } = req.body;
    const mealIndex = meals.findIndex(meal => meal.id === mealId && meal.userId === req.user.id);
    if (mealIndex === -1) {
        res.status(404);
        throw new Error('Posiłek nie znaleziono lub nie masz do niego dostępu');
    }
    meals[mealIndex] = { ...meals[mealIndex], day, time, name, calories: parseInt(calories) };
    res.json(meals[mealIndex]);
});

const deleteMeal = asyncHandler(async (req, res) => {
    const mealId = parseInt(req.params.id);
    const initialLength = meals.length;
    meals = meals.filter(meal => !(meal.id === mealId && meal.userId === req.user.id));
    if (meals.length === initialLength) {
        res.status(404);
        throw new Error('Posiłek nie znaleziono lub nie masz do niego dostępu');
    }
    res.status(200).json({ message: 'Posiłek usunięty pomyślnie' });
});

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };