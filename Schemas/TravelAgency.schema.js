const mongoose = require("mongoose");

const travelAgencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  helplineNumber: { type: String, required: true },
  logoUrl: { type: String, required: true },
  userFeedback: [{ type: String }],
});

const model = mongoose.model("TravelAgency", travelAgencySchema);

module.exports = model;
