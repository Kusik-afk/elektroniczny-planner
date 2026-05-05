const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword } = require('../controllers/authController'); // Importujemy changePassword
const { protect } = require('../middleware/authMiddleware'); // Potrzebne do ochrony trasy

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/change-password', protect, changePassword); // Nowa trasa chroniona

module.exports = router;