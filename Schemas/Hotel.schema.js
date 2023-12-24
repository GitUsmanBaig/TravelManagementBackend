const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  title: String,
  description: String,
  discountRate: Number, // e.g., 10 for a 10% discount
  validFrom: Date,
  validUntil: Date
});

const roomTypeSchema = new mongoose.Schema({
  type: String,
  price: Number,
  availability: Number
});

const hotelSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelOwnerProfile', 
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  city: { type: String, required: true },
  imagePaths: [{ type: String, required: true }], 
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  spaceAvailable: { type: Number, required: true },
  description: { type: String, required: true },
  roomTypes: [roomTypeSchema], // Array of room types
  blackoutDates: [Date], // Dates when the hotel is not available for booking
  promotions: [promotionSchema] // Array of promotional offers
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
