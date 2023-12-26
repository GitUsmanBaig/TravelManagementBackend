const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile', 
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: {
    type: String,
    required: 'Please provide a review comment'
  },
  reviewDate: {
    type: Date,
    default: Date.now
  },
  response: {
    type: String // for the hotel owner's response to the review
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
