const Customer = require('../../Schemas/Customer.schema');
const Reservation = require('../Schema/Reservation.schema');
const Hotel = require('../../Schemas/Hotel.schema');


const ReservationController = {
    getAllReservationsForOwner: async (req, res) => {
        try {
            // Step 1: Get all hotels owned by the logged-in hotel owner.
            const hotels = await Hotel.find({ owner: req.hotelOwner._id }).select('_id');
            const hotelIds = hotels.map(hotel => hotel._id);
    
            // Step 2: Query all reservations for the hotels owned by the hotel owner.
            const reservations = await Reservation.find({ hotel: { $in: hotelIds } })
                                                  .populate('hotel')
                                                  .populate('guest', 'name email');
            res.json(reservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            res.status(500).send(error.message);
        }
    },
    

    getReservationDetails: async (req, res) => {
        try {
            // Find all hotels owned by the hotel owner
            const hotels = await Hotel.find({ owner: req.hotelOwner._id }).select('_id');
            const hotelIds = hotels.map(hotel => hotel._id);
    
            // Find the reservation with the given ID that belongs to one of the hotels owned by the hotel owner
            const reservation = await Reservation.findOne({
                _id: req.params.reservationId,
                hotel: { $in: hotelIds }
            }).populate('hotel').populate('guest', 'name email');
    
            if (!reservation) {
                return res.status(404).send('Reservation not found or you do not have permission to view it.');
            }
    
            res.json(reservation);
        } catch (error) {
            console.error('Error fetching reservation details:', error);
            res.status(500).send(error.message);
        }
    },
    

    updateReservationStatus: async (req, res) => {
        try {
            // Find all hotels owned by the hotel owner
            const hotels = await Hotel.find({ owner: req.hotelOwner._id }).select('_id');
            const hotelIds = hotels.map(hotel => hotel._id);
    
            // Update the reservation status if the reservation belongs to one of the hotels owned by the hotel owner
            const reservation = await Reservation.findOneAndUpdate(
                {
                    _id: req.params.reservationId,
                    hotel: { $in: hotelIds }
                },
                { status: req.body.status },
                { new: true }
            ).populate('hotel').populate('guest', 'name email');
    
            if (!reservation) {
                return res.status(404).send('Reservation not found or you do not have permission to update it.');
            }
    
            res.json(reservation);
        } catch (error) {
            console.error('Error updating reservation status:', error);
            res.status(500).send(error.message);
        }
    },
    
};

module.exports = ReservationController;
