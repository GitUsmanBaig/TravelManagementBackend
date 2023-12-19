const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    response: String, // hotel owner's response
    createdAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: Date // date of hotel owner's response
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
