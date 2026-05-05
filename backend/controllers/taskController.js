const asyncHandler = require('express-async-handler');
const Task = require('../models/Task'); // Importujemy model zadania

// @desc    Pobierz wszystkie zadania dla zalogowanego użytkownika
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const { completed, priority, sortBy, sortDir, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    // Filtrowanie
    if (completed !== undefined && completed !== 'all') { // 'all' oznacza brak filtra
        query.completed = completed === 'true'; // Konwertuj string na boolean
    }
    if (priority && priority !== 'all') {
        query.priority = priority;
    }

    // Sortowanie
    const sort = {};
    if (sortBy) {
        sort[sortBy] = sortDir === 'desc' ? -1 : 1;
    } else {
        sort.createdAt = -1; // Domyślne sortowanie: najnowsze na górze
    }

    // Paginacja (na razie nie używamy jej na froncie, ale backend jest gotowy)
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const tasks = await Task.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    const totalTasks = await Task.countDocuments(query); // Całkowita liczba zadań dla paginacji

    res.json({
        tasks,
        currentPage: pageNum,
        totalPages: Math.ceil(totalTasks / limitNum),
        totalItems: totalTasks,
    });
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
    const taskId = req.params.id;
    const { name, priority, completed } = req.body;

    let task = await Task.findOne({ _id: taskId, userId: req.user.id });

    if (!task) {
        res.status(404);
        throw new Error('Zadanie nie znaleziono lub nie masz do niego dostępu');
    }

    task.name = name !== undefined ? name : task.name;
    task.priority = priority !== undefined ? priority : task.priority;
    task.completed = completed !== undefined ? completed : task.completed;

    const updatedTask = await task.save();

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