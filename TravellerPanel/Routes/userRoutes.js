const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { authenticate_user } = require('../Middleware/authMiddleware');
const { signup_user, login_user, forgot_password } = require('../Controller/userController');

// Route to handle user signup
router.post('/signup_user', userController.signup_user);

// Route to handle user login
router.post('/login_user', userController.login_user);

router.post('/forgot_password', userController.forgot_password);

module.exports = router;