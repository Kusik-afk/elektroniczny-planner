const asyncHandler = require('express-async-handler');
const Task = require('../models/Task'); // Importujemy model zadania

// @desc    Pobierz wszystkie zadania dla zalogowanego użytkownika z filtrowaniem i sortowaniem
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const { completed, priority, sortBy, sortDir, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    // Filtrowanie
    if (completed !== undefined && completed !== 'all') { // 'all' oznacza brak filtra
        query.completed = completed === 'true'; // Konwertuj string na boolean
    }
    if (priority && priority !== 'all') { // 'all' oznacza brak filtra
        query.priority = priority;
    }

    // Sortowanie
    const sort = {};
    if (sortBy) {
        sort[sortBy] = sortDir === 'desc' ? -1 : 1;
    } else {
        sort.createdAt = -1; // Domyślne sortowanie: najnowsze na górze
    }

    // Paginacja
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
    const { name, priority, description, dueDate } = req.body; // Dodano description i dueDate

    if (!name) {
        res.status(400);
        throw new Error('Proszę podać nazwę zadania');
    }

    const task = await Task.create({
        userId: req.user.id, // Przypisujemy zadanie do zalogowanego użytkownika
        name,
        priority: priority || 'niski', // Ustaw domyślny priorytet, jeśli nie podano
        description, // Dodano
        dueDate: dueDate ? new Date(dueDate) : undefined, // Dodano, konwersja na Date
    });

    res.status(201).json(task);
});

// @desc    Zaktualizuj zadanie
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { name, priority, completed, description, dueDate } = req.body; // Dodano description i dueDate

    let task = await Task.findOne({ _id: taskId, userId: req.user.id });

    if (!task) {
        res.status(404);
        throw new Error('Zadanie nie znaleziono lub nie masz do niego dostępu');
    }

    // Aktualizujemy tylko te pola, które są zdefiniowane w req.body
    if (name !== undefined) task.name = name;
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = completed;
    if (description !== undefined) task.description = description; // Dodano
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null; // Dodano, obsługa null dla usunięcia daty

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