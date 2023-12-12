const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const feedbackSchema = new Schema({
    reviews: [String],
    ratings: [Number],
    responses: [String]
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;