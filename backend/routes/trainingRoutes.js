const express = require('express');
const router = express.Router();
const {
    getTrainings,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTrainings).post(protect, createTraining);
router.route('/:id').put(protect, updateTraining).delete(protect, deleteTraining);

module.exports = router;