const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
});

const model = mongoose.model("Admin", AdminSchema);

module.exports = model;
