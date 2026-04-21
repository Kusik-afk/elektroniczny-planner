const asyncHandler = require('express-async-handler');
const Task = require('../models/Task'); // Importujemy model zadania

// @desc    Pobierz wszystkie zadania dla zalogowanego użytkownika
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    // Znajdujemy zadania, gdzie userId pasuje do id zalogowanego użytkownika
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

// @desc    Utwórz nowe zadanie
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { name, priority } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Proszę podać nazwę zadania');
    }

    const task = await Task.create({
        userId: req.user.id, // Przypisujemy zadanie do zalogowanego użytkownika
        name,
        priority,
    });

    res.status(201).json(task);
});

// @desc    Zaktualizuj zadanie
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id; // ID z URL
    const { name, priority, completed } = req.body;

    // Znajdujemy zadanie i upewniamy się, że należy do zalogowanego użytkownika
    let task = await Task.findOne({ _id: taskId, userId: req.user.id });

    if (!task) {
        res.status(404);
        throw new Error('Zadanie nie znaleziono lub nie masz do niego dostępu');
    }

    // Aktualizujemy pola
    task.name = name || task.name;
    task.priority = priority || task.priority;
    task.completed = completed !== undefined ? completed : task.completed;

    const updatedTask = await task.save(); // Zapisujemy zmiany

    res.json(updatedTask);
});

// @desc    Usuń zadanie
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;

    // Znajdujemy i usuwamy zadanie należące do zalogowanego użytkownika
    const result = await Task.deleteOne({ _id: taskId, userId: req.user.id });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('Zadanie nie znaleziono lub nie masz do niego dostępu');
    }

    res.status(200).json({ message: 'Zadanie usunięte pomyślnie' });
});

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};