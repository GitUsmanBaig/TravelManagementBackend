const Inquiry = require('../Schema/Inquiry.schema');

const InquiryController = {
    getInquiriesForHotel: async (req, res) => {
        try {
            const inquiries = await Inquiry.find({ hotel: req.params.hotelId }).populate('guest', 'name email');
            res.json(inquiries);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    respondToInquiry: async (req, res) => {
        try {
            const { response } = req.body;
            const inquiry = await Inquiry.findOneAndUpdate(
                { _id: req.params.inquiryId, hotel: req.params.hotelId },
                { response, respondedAt: new Date() },
                { new: true }
            );
            if (!inquiry) return res.status(404).send('Inquiry not found or not for your hotel.');

            res.json(inquiry);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = InquiryController;
