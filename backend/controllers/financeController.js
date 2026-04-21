const asyncHandler = require('express-async-handler');

const financeEntries = []; // { id, userId, type, amount, description, date }

const getFinances = asyncHandler(async (req, res) => {
    const userFinance = financeEntries.filter(entry => entry.userId === req.user.id);
    res.json(userFinance);
});

const createFinanceEntry = asyncHandler(async (req, res) => {
    const { type, amount, description, date } = req.body;
    if (!type || !amount || !description || !date) {
        res.status(400);
        throw new Error('Proszę podać wszystkie dane wpisu finansowego');
    }
    const newEntry = {
        id: financeEntries.length + 1,
        userId: req.user.id,
        type, amount: parseFloat(amount), description, date,
    };
    financeEntries.push(newEntry);
    res.status(201).json(newEntry);
});

const updateFinanceEntry = asyncHandler(async (req, res) => {
    const entryId = parseInt(req.params.id);
    const { type, amount, description, date } = req.body;
    const entryIndex = financeEntries.findIndex(entry => entry.id === entryId && entry.userId === req.user.id);
    if (entryIndex === -1) {
        res.status(404);
        throw new Error('Wpis finansowy nie znaleziono lub nie masz do niego dostępu');
    }
    financeEntries[entryIndex] = { ...financeEntries[entryIndex], type, amount: parseFloat(amount), description, date };
    res.json(financeEntries[entryIndex]);
});

const deleteFinanceEntry = asyncHandler(async (req, res) => {
    const entryId = parseInt(req.params.id);
    const initialLength = financeEntries.length;
    financeEntries = financeEntries.filter(entry => !(entry.id === entryId && entry.userId === req.user.id));
    if (financeEntries.length === initialLength) {
        res.status(404);
        throw new Error('Wpis finansowy nie znaleziono lub nie masz do niego dostępu');
    }
    res.status(200).json({ message: 'Wpis finansowy usunięty pomyślnie' });
});

module.exports = { getFinances, createFinanceEntry, updateFinanceEntry, deleteFinanceEntry };