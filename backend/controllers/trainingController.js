const asyncHandler = require('express-async-handler');

const trainings = []; // { id, userId, type, duration, date }

const getTrainings = asyncHandler(async (req, res) => {
    const userTrainings = trainings.filter(training => training.userId === req.user.id);
    res.json(userTrainings);
});

const createTraining = asyncHandler(async (req, res) => {
    const { type, duration, date } = req.body;
    if (!type || !duration || !date) {
        res.status(400);
        throw new Error('Proszę podać wszystkie dane treningu');
    }
    const newTraining = {
        id: trainings.length + 1,
        userId: req.user.id,
        type, duration: parseInt(duration), date,
    };
    trainings.push(newTraining);
    res.status(201).json(newTraining);
});

const updateTraining = asyncHandler(async (req, res) => {
    const trainingId = parseInt(req.params.id);
    const { type, duration, date } = req.body;
    const trainingIndex = trainings.findIndex(training => training.id === trainingId && training.userId === req.user.id);
    if (trainingIndex === -1) {
        res.status(404);
        throw new Error('Trening nie znaleziono lub nie masz do niego dostępu');
    }
    trainings[trainingIndex] = { ...trainings[trainingIndex], type, duration: parseInt(duration), date };
    res.json(trainings[trainingIndex]);
});

const deleteTraining = asyncHandler(async (req, res) => {
    const trainingId = parseInt(req.params.id);
    const initialLength = trainings.length;
    trainings = trainings.filter(training => !(training.id === trainingId && training.userId === req.user.id));
    if (trainings.length === initialLength) {
        res.status(404);
        throw new Error('Trening nie znaleziono lub nie masz do niego dostępu');
    }
    res.status(200).json({ message: 'Trening usunięty pomyślnie' });
});

module.exports = { getTrainings, createTraining, updateTraining, deleteTraining };