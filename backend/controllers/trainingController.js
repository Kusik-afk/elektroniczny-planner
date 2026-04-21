const asyncHandler = require('express-async-handler');
const Workout = require('../models/Workout'); // Importujemy model treningu

// @desc    Pobierz wszystkie treningi dla zalogowanego użytkownika
// @route   GET /api/trainings
// @access  Private
const getTrainings = asyncHandler(async (req, res) => {
    // Znajdujemy treningi, gdzie userId pasuje do id zalogowanego użytkownika
    const trainings = await Workout.find({ userId: req.user.id });
    res.json(trainings);
});

// @desc    Utwórz nowy trening
// @route   POST /api/trainings
// @access  Private
const createTraining = asyncHandler(async (req, res) => {
    const { type, duration, date, distance, notes } = req.body;

    // Walidacja podstawowa (Mongoose schema też ma walidację 'required')
    if (!type || !duration || !date) {
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
    training.type = type || training.type;
    training.duration = duration !== undefined ? parseInt(duration) : training.duration;
    training.date = date ? new Date(date) : training.date;
    training.distance = distance !== undefined ? parseFloat(distance) : training.distance;
    training.notes = notes !== undefined ? notes : training.notes;

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