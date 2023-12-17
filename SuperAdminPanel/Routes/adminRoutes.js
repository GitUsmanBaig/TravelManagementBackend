const express = require('express');
const router = express.Router();
const adminController = require('../Controller/AdminController');
const { authenticate_admin } = require('../Middleware/authMiddleware');

// Route to handle admin signup
router.post('/signup_admin', adminController.signup_admin);

router.post('/login_admin', adminController.login_admin);

router.post('/forgot_password', adminController.forgot_password);

//disable user
router.put('/disable_user/:userId', authenticate_admin, adminController.disable_user);

//enable user
router.put('/enable_user/:userId', authenticate_admin, adminController.enable_user);

module.exports = router;

