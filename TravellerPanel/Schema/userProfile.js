const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    name: String,
    email: String,
    password: String,
    CNIC: String,
    contact: String,
    preferences: [String],
    disabled: Boolean,
    respnses: [String],
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;
