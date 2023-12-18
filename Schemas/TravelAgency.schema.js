const mongoose = require("mongoose");

const travelAgencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  helplineNumber: { type: String, required: true },
  logoUrl: { type: String, required: true },
  userFeedback: [{ 
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    feedback: String 
  }],
  noOfPackages: { type: Number, default: 0 },
});

const model = mongoose.model("TravelAgency", travelAgencySchema);

module.exports = model;
