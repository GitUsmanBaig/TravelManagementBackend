const express = require('express');
const { authenticateHotelOwner } = require('../Middleware/authMiddleware');
const ReviewController = require('../Controller/ReviewController');

const router = express.Router();

// Get all reviews for the hotel owner's properties
router.get('/', authenticateHotelOwner, ReviewController.getAllReviewsForOwner);

// Respond to a review for a property
router.post('/:reviewId/respond', authenticateHotelOwner, ReviewController.respondToReview);

module.exports = router;
