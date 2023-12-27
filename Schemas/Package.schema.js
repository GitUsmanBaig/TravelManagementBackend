const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String, required: true },
  otherFacilites: [{ type: String }],
  totalAmount: { type: Number, required: true },
  noOfPersons: { type: Number, required: true },
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
  disabled: { type: Boolean, default: false },
  ratings: [{ type: Number }],
  reviews: [{ type: String }],
  avgRating: { type: Number },
  counttotalbookings: { type: Number, default: 0 },
  packageCategory: {
    type: String,
    enum: [
      "Adventure",
      "Family",
      "Honeymoon",
      "Religious",
      "Wildlife",
      "Group",
      "Solo",
      "Friends",
      "Summer",
      "Winter",
      "Spring",
      "Autumn",
    ],
    default: "Family",
  },
});

const model = mongoose.model("Package", packageSchema);

module.exports = model;
