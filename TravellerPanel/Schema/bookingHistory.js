const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingHistorySchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    bookingDate: { type: Date, default: Date.now },
    noOfPersons: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    city: { type: String, required: true },
    hotel: { type: String, required: true },
    travelAgency: { type: String, required: true },
    travelAgencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TravelAgency",
        required: true,
    },
    //travelAgencyhelplineNumber: {type: String, required: true},
});

const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema);
module.exports = BookingHistory;