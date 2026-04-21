const asyncHandler = require('express-async-handler');
const FinanceRecord = require('../models/FinanceRecord'); // Importujemy model wpisu finansowego

// @desc    Pobierz wszystkie wpisy finansowe dla zalogowanego użytkownika
// @route   GET /api/finance
// @access  Private
const getFinances = asyncHandler(async (req, res) => {
    const financeRecords = await FinanceRecord.find({ userId: req.user.id });
    res.json(financeRecords);
});

// @desc    Utwórz nowy wpis finansowy
// @route   POST /api/finance
// @access  Private
const createFinanceEntry = asyncHandler(async (req, res) => {
    const { type, amount, description, category, date } = req.body;

    // Walidacja podstawowa
    if (!type || !amount || !description || !date) {
        res.status(400);
        throw new Error('Proszę podać typ, kwotę, opis i datę wpisu finansowego');
    }

    const financeRecord = await FinanceRecord.create({
        userId: req.user.id, // Przypisujemy wpis do zalogowanego użytkownika
        type,
        amount: parseFloat(amount), // Upewnij się, że to liczba
        description,
        category, // Opcjonalne pole
        date: new Date(date), // Konwertujemy string na obiekt Date
    });

    res.status(201).json(financeRecord);
});

// @desc    Zaktualizuj wpis finansowy
// @route   PUT /api/finance/:id
// @access  Private
const updateFinanceEntry = asyncHandler(async (req, res) => {
    const entryId = req.params.id; // ID wpisu z URL
    const { type, amount, description, category, date } = req.body;

    // Znajdujemy wpis i upewniamy się, że należy do zalogowanego użytkownika
    let financeRecord = await FinanceRecord.findOne({ _id: entryId, userId: req.user.id });

    if (!financeRecord) {
        res.status(404);
        throw new Error('Wpis finansowy nie znaleziono lub nie masz do niego dostępu');
    }

    // Aktualizujemy pola
    financeRecord.type = type || financeRecord.type;
    financeRecord.amount = amount !== undefined ? parseFloat(amount) : financeRecord.amount;
    financeRecord.description = description || financeRecord.description;
    financeRecord.category = category !== undefined ? category : financeRecord.category;
    financeRecord.date = date ? new Date(date) : financeRecord.date;

    const updatedFinanceRecord = await financeRecord.save(); // Zapisujemy zmiany

    res.json(updatedFinanceRecord);
});

// @desc    Usuń wpis finansowy
// @route   DELETE /api/finance/:id
// @access  Private
const deleteFinanceEntry = asyncHandler(async (req, res) => {
    const entryId = req.params.id;

    // Znajdujemy i usuwamy wpis należący do zalogowanego użytkownika
    const result = await FinanceRecord.deleteOne({ _id: entryId, userId: req.user.id });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('Wpis finansowy nie znaleziono lub nie masz do niego dostępu');
    }

    res.status(200).json({ message: 'Wpis finansowy usunięty pomyślnie' });
});

module.exports = {
    getFinances,
    createFinanceEntry,
    updateFinanceEntry,
    deleteFinanceEntry,
};