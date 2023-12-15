const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { authenticate_user } = require('../Middleware/authMiddleware');
const { signup_user, login_user, forgot_password, logout_user, customize_profile } = require('../Controller/userController');

// Route to handle user signup
router.post('/signup_user', userController.signup_user);

router.post('/login_user', userController.login_user);

router.post('/forgot_password', userController.forgot_password);

router.get('/logout_user', authenticate_user, userController.logout_user);

router.post('/customize_profile', authenticate_user, userController.customize_profile);

module.exports = router;