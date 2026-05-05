const asyncHandler = require('express-async-handler');
const Workout = require('../models/Workout'); // Importujemy model treningu

// @desc    Pobierz wszystkie treningi dla zalogowanego użytkownika z filtrowaniem i sortowaniem
// @route   GET /api/trainings
// @access  Private
const getTrainings = asyncHandler(async (req, res) => {
    const { type, sortBy, sortDir, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    // Filtrowanie
    if (type && type !== 'Wszystkie') { // 'Wszystkie' oznacza brak filtra
        query.type = type;
    }

    // Sortowanie
    const sort = {};
    if (sortBy) {
        sort[sortBy] = sortDir === 'desc' ? -1 : 1;
    } else {
        sort.date = -1; // Domyślne sortowanie: najnowsze na górze
    }

    // Paginacja
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const trainings = await Workout.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    const totalTrainings = await Workout.countDocuments(query);

    res.json({
        trainings,
        currentPage: pageNum,
        totalPages: Math.ceil(totalTrainings / limitNum),
        totalItems: totalTrainings,
    });
});

// @desc    Utwórz nowy trening
// @route   POST /api/trainings
// @access  Private
const createTraining = asyncHandler(async (req, res) => {
    const { type, duration, date, distance, notes } = req.body;

    // Walidacja podstawowa (Mongoose schema też ma walidację 'required')
    if (!type || duration === undefined || !date) { // Sprawdzamy duration !== undefined
        res.status(400);
        throw new Error('Proszę podać typ, czas trwania i datę treningu');
    }

    const training = await Workout.create({
        userId: req.user.id, // Przypisujemy trening do zalogowanego użytkownika
        type,
        duration: parseInt(duration), // Upewnij się, że to liczba
        date: new Date(date), // Konwertujemy string na obiekt Date
        distance: distance ? parseFloat(distance) : undefined, // Opcjonalne pole
        notes,
    });

    res.status(201).json(training);
});

// @desc    Zaktualizuj trening
// @route   PUT /api/trainings/:id
// @access  Private
const updateTraining = asyncHandler(async (req, res) => {
    const trainingId = req.params.id; // ID treningu z URL
    const { type, duration, date, distance, notes } = req.body;

    // Znajdujemy trening i upewniamy się, że należy do zalogowanego użytkownika
    let training = await Workout.findOne({ _id: trainingId, userId: req.user.id });

    if (!training) {
        res.status(404);
        throw new Error('Trening nie znaleziono lub nie masz do niego dostępu');
    }

    // Aktualizujemy pola
    if (type !== undefined) training.type = type;
    if (duration !== undefined) training.duration = parseInt(duration);
    if (date !== undefined) training.date = new Date(date);
    if (distance !== undefined) training.distance = parseFloat(distance);
    if (notes !== undefined) training.notes = notes;

    const updatedTraining = await training.save(); // Zapisujemy zmiany

    res.json(updatedTraining);
});

// @desc    Usuń trening
// @route   DELETE /api/trainings/:id
// @access  Private
const deleteTraining = asyncHandler(async (req, res) => {
    const trainingId = req.params.id;

    // Znajdujemy i usuwamy trening należący do zalogowanego użytkownika
    const result = await Workout.deleteOne({ _id: trainingId, userId: req.user.id });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('Trening nie znaleziono lub nie masz do niego dostępu');
    }

    res.status(200).json({ message: 'Trening usunięty pomyślnie' });
});

module.exports = {
    getTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
};