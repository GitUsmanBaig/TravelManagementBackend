const express = require('express');
const { authenticateHotelOwner } = require('../Middleware/authMiddleware');
const ReservationController = require('../Controller/ReservationController');

const router = express.Router();

// Get all reservations for the hotel owner's properties
router.get('/', authenticateHotelOwner, ReservationController.getAllReservationsForOwner);

// Get details of a single reservation for the hotel owner's property
router.get('/:reservationId', authenticateHotelOwner, ReservationController.getReservationDetails);

// Update a reservation's status
router.put('/:reservationId', authenticateHotelOwner, ReservationController.updateReservationStatus);

module.exports = router;
