const asyncHandler = require('express-async-handler');

// Prosta baza danych zadań w pamięci serwera
const tasks = []; // Będzie przechowywać { id, userId, name, priority, completed }

// @desc    Pobierz wszystkie zadania dla zalogowanego użytkownika
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.user.id);
    res.json(userTasks);
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

    const newTask = {
        id: tasks.length + 1,
        userId: req.user.id,
        name,
        priority: priority || 'niski',
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// @desc    Zaktualizuj zadanie
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id);
    const { name, priority, completed } = req.body;

    const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === req.user.id);

    if (taskIndex === -1) {
        res.status(404);
        throw new Error('Zadanie nie znaleziono lub nie masz do niego dostępu');
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        name: name || tasks[taskIndex].name,
        priority: priority || tasks[taskIndex].priority,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    };

    res.json(tasks[taskIndex]);
});

// @desc    Usuń zadanie
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id);
    const initialLength = tasks.length;

    // Usuwamy zadanie tylko jeśli należy do zalogowanego użytkownika
    tasks = tasks.filter(task => !(task.id === taskId && task.userId === req.user.id));

    if (tasks.length === initialLength) {
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