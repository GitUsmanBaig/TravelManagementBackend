const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  CNIC: String,
  contact: String,
  preferences: [String],
  disabled: Boolean,
});

const model = mongoose.model("Customer", customerSchema);

module.exports = model;
