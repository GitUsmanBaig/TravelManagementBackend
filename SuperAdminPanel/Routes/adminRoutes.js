const express = require('express');
const router = express.Router();
const adminController = require('../Controller/AdminController');
const { authenticate_admin } = require('../Middleware/authMiddleware');

// Route to handle admin signup
router.post('/signup_admin', adminController.signup_admin);

router.post('/login_admin', adminController.login_admin);

router.post('/forgot_password', adminController.forgot_password);

//get all users
router.get('/getAllUsers', authenticate_admin, adminController.get_all_users);

//disable user
router.put('/disable_user/:userId', authenticate_admin, adminController.disable_user);

//enable user
router.put('/enable_user/:userId', authenticate_admin, adminController.enable_user);

//get all packages
router.get('/getAllPackages', authenticate_admin, adminController.getAllPackages);

//disable package
router.put('/disable_package/:packageId', authenticate_admin, adminController.disable_package);

//enable package
router.put('/enable_package/:packageId', authenticate_admin, adminController.enable_package);

//update package
router.put('/update_package/:packageId', authenticate_admin, adminController.update_Package);

//view trend
router.get('/view_trend', authenticate_admin, adminController.view_trend);

//view user trends
router.get('/view_user_trend', authenticate_admin, adminController.view_user_trends);

//get all travel agencies
router.get('/getAllTravelAgencies', authenticate_admin, adminController.get_all_travelagencies);

//get all feedbacks
router.get('/getAllFeedbacks', authenticate_admin, adminController.get_all_feedbacks);

//respond to feedback
router.post('/reply-feedback/:feedbackId', authenticate_admin, adminController.replyToFeedback);

//get all ratings
router.get('/getAllRatings', authenticate_admin, adminController.getAllRatings);

//count users
router.get('/countUsers', authenticate_admin, adminController.count_total_users);

//count travel agencies
router.get('/countTravelAgencies', authenticate_admin, adminController.count_total_travelagencies);

module.exports = router;

