const express = require('express');
const router = express.Router();
const {
    getFinances,
    createFinanceEntry,
    updateFinanceEntry,
    deleteFinanceEntry
} = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFinances).post(protect, createFinanceEntry);
router.route('/:id').put(protect, updateFinanceEntry).delete(protect, deleteFinanceEntry);

module.exports = router;