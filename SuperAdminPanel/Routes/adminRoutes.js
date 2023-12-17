const express = require('express');
const router = express.Router();
const adminController = require('../Controller/AdminController');
const { authenticate_admin } = require('../Middleware/authMiddleware');

// Route to handle admin signup
router.post('/signup_admin', adminController.signup_admin);

router.post('/login_admin', adminController.login_admin);

module.exports = router;

