const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { authenticate_user } = require('../Middleware/authMiddleware');
const { signup_user, login_user, forgot_password, logout_user, customize_profile, getAllPackages } = require('../Controller/userController');

// Route to handle user signup
router.post('/signup_user', userController.signup_user);

router.post('/login_user', userController.login_user);

router.post('/forgot_password', userController.forgot_password);

router.get('/logout_user', authenticate_user, userController.logout_user);

router.post('/customize_profile', authenticate_user, userController.customize_profile);

router.get('/getProfile', authenticate_user, userController.getProfile);

router.get('/getAllPackages', authenticate_user, userController.getAllPackages);

router.put('/bookPackage/:id', authenticate_user, userController.bookPackage);

router.put('/confirmationPackage/:id', authenticate_user, userController.confirmationPackage);

router.put('/cancelBooking/:id', authenticate_user, userController.cancelBooking);

router.put('/updateBooking/:id', authenticate_user, userController.updateBooking);

router.get('/getBookings', authenticate_user, userController.getBookings);

router.get('/getBookings/:id', authenticate_user, userController.getBookingById);

router.get('/getPackageById/:id', authenticate_user, userController.getPackageById);

router.put('/addRating/:id', authenticate_user, userController.addRating);

router.put('/addReview/:id', authenticate_user, userController.addReview);

router.post('/addComplaint/:id', authenticate_user, userController.sendFeedback);

router.get('/getAllBookingHistory', authenticate_user, userController.getBookingHistory);

router.get('/getFeedbacksSent', authenticate_user, userController.getFeedbacksSent);

router.get('/getFeedbacksReceived/:id', authenticate_user, userController.getFeedbacksReceived);

router.get('/getHotelofPackage/:id', authenticate_user, userController.getHotelbyID);

router.get('/getTravelAgency', authenticate_user, userController.getTravelAgency);//to remove

router.post('/addHotelReview/:id', authenticate_user, userController.addHotelReview);

module.exports = router;