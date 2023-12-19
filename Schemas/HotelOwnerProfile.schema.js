const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const hotelOwnerProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

//hashing
hotelOwnerProfileSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

//valdating
hotelOwnerProfileSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const HotelOwnerProfile = mongoose.model('HotelOwnerProfile', hotelOwnerProfileSchema);

module.exports = HotelOwnerProfile;
