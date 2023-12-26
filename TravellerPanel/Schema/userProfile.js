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
    responses: [
        {
            
            feedbackId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TravelAgency.userFeedback",
                required: true
            },
            feedback: { type: String, required: true }
        }
    ],
    responceCount: { type: Number, default: 0 },
    bookingamount: { type: Number, default: 0 },
    counttotalbookings: { type: Number, default: 0 },
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;
