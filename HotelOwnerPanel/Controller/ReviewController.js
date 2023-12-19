const Review = require('../Schema/Review.schema');
const Hotel = require('D:/BS(SE)/Semester 5/Web Engineering/Project/TravelManagementBackend/Schemas/Hotel.schema.js');

const ReviewController = {
    getAllReviewsForOwner: async (req, res) => {
        try {

            const hotels = await Hotel.find({ owner: req.hotelOwner._id });
            const hotelIds = hotels.map(hotel => hotel._id);

            const reviews = await Review.find({ hotel: { $in: hotelIds } })
                                       .populate('hotel', 'name')
                                       .populate('guest', 'name');
            
            res.json(reviews);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    respondToReview: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const { response } = req.body; // response in the request body

            // Find review ensure ownership
            const review = await Review.findOne({
                _id: reviewId,
                hotel: { $in: (await Hotel.find({ owner: req.hotelOwner._id })).map(hotel => hotel._id) }
            });

            if (!review) {
                return res.status(404).send('Review not found or not associated with any of your hotels.');
            }

            review.response = response;
            await review.save();

            res.json(review);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = ReviewController;
