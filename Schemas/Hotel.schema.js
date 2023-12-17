const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  city: { type: String, required: true },
  homeImageUrl: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  spaceAvailable: { type: Number, required: true },
});

const model = mongoose.model("Hotel", hotelSchema);

module.exports = model;
