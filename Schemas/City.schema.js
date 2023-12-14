const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
});

const model = mongoose.model("City", citySchema);

module.exports = model;
