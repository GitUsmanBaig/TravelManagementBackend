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

// Update pricing for a specific room type in a hotel
router.put('/:id/roomTypes/:roomId/price', authenticateHotelOwner, HotelController.updateRoomPricing);

// Update availability for a specific room type in a hotel
router.put('/:id/roomTypes/:roomId/availability', authenticateHotelOwner, HotelController.updateAvailability);

// Update blackout dates for a hotel
router.put('/:id/blackoutDates', authenticateHotelOwner, HotelController.updateBlackoutDates);

// Add a new promotion
router.post('/:id/promotions', authenticateHotelOwner, HotelController.addPromotion);

// List all promotions for a hotel
router.get('/:id/promotions', authenticateHotelOwner, HotelController.listPromotions);

// Update a specific promotion
router.put('/:hotelId/promotions/:promotionId', authenticateHotelOwner, HotelController.updatePromotion);

// Delete a specific promotion
router.delete('/:hotelId/promotions/:promotionId', authenticateHotelOwner, HotelController.deletePromotion);

// Get all inquiries for a specific hotel
router.get('/:hotelId/inquiries', authenticateHotelOwner, InquiryController.getInquiriesForHotel);

// Respond to a specific inquiry
router.post('/:hotelId/inquiries/:inquiryId/respond', authenticateHotelOwner, InquiryController.respondToInquiry);

module.exports = router;
