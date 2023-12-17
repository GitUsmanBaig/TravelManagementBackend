const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  noOfPersons: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String, required: true },
  otherImages: [{ type: String, required: true }],

  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  travelAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TravelAgency",
    required: true,
  },
});

const model = mongoose.model("Package", packageSchema);

module.exports = model;
