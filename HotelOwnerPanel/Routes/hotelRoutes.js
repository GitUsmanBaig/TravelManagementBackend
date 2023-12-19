const express = require('express');
const { authenticateHotelOwner } = require('../Middleware/authMiddleware');
const HotelController = require('../Controller/HotelController');

const router = express.Router();

// List properties owned by the hotel owner
router.get('/', authenticateHotelOwner, HotelController.listProperties);

// Get details of a single property
router.get('/:id', authenticateHotelOwner, HotelController.getPropertyDetails);

// Create a new property
router.post('/', authenticateHotelOwner, HotelController.createProperty);

// Update property details
router.put('/:id', authenticateHotelOwner, HotelController.updatePropertyDetails);

// Delete a property
router.delete('/:id', authenticateHotelOwner, HotelController.deleteProperty);

module.exports = router;
