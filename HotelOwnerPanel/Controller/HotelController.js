const Hotel = require('../Schema/Hotel.schema');

const HotelController = {
    listProperties: async (req, res) => {
        try {
            const hotels = await Hotel.find({ owner: req.hotelOwner._id });
            res.json(hotels);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getPropertyDetails: async (req, res) => {
        try {
            const hotel = await Hotel.findOne({ _id: req.params.id, owner: req.hotelOwner._id });
            if (!hotel) return res.status(404).send('Hotel not found');
            res.json(hotel);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    createProperty: async (req, res) => {
        try {
            const newHotel = new Hotel({ ...req.body, owner: req.hotelOwner._id });
            await newHotel.save();
            res.status(201).send(newHotel);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    updatePropertyDetails: async (req, res) => {
        try {
            const updatedHotel = await Hotel.findOneAndUpdate(
                { _id: req.params.id, owner: req.hotelOwner._id },
                req.body,
                { new: true }
            );
            if (!updatedHotel) return res.status(404).send('Hotel not found or not owned by you.');
            res.send(updatedHotel);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    deleteProperty: async (req, res) => {
        try {
            const hotel = await Hotel.findOneAndDelete({ _id: req.params.id, owner: req.hotelOwner._id });
            if (!hotel) return res.status(404).send('Hotel not found or not owned by you.');
            res.send({ message: 'Hotel successfully deleted' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = HotelController;
