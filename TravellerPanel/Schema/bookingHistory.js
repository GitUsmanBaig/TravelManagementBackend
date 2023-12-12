const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingHistorySchema = new Schema({
    reservations: [String],
    travelPackages: [String],
    flights: [String]
});

const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema);
module.exports = BookingHistory;