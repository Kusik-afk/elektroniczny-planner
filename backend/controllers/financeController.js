const asyncHandler = require('express-async-handler');
const FinanceRecord = require('../models/FinanceRecord'); // Importujemy model wpisu finansowego

// @desc    Pobierz wszystkie wpisy finansowe dla zalogowanego użytkownika
// @route   GET /api/finance
// @access  Private
const getFinances = asyncHandler(async (req, res) => {
    const { type, category, month, year, sortBy, sortDir, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    // Filtrowanie
    if (type && type !== 'all') {
        query.type = type;
    }
    if (category && category !== 'all') {
        query.category = category;
    }
    if (month && month !== 'all' && year && year !== 'all') {
        const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endOfMonth = new Date(parseInt(year), parseInt(month), 0); // Ostatni dzień miesiąca
        query.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (year && year !== 'all') { // Filtrowanie tylko po roku
        const startOfYear = new Date(parseInt(year), 0, 1);
        const endOfYear = new Date(parseInt(year), 11, 31);
        query.date = { $gte: startOfYear, $lte: endOfYear };
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

    const financeRecords = await FinanceRecord.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    const totalRecords = await FinanceRecord.countDocuments(query);

    res.json({
        financeRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / limitNum),
        totalItems: totalRecords,
    });
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