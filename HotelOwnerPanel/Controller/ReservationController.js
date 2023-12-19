const Reservation = require('../Schema/Reservation.schema');

const ReservationController = {
    getAllReservationsForOwner: async (req, res) => {
        try {
            const reservations = await Reservation.find({ 'hotel.owner': req.hotelOwner._id })
                                                  .populate('hotel')
                                                  .populate('guest', 'name email');
            res.json(reservations);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getReservationDetails: async (req, res) => {
        try {
            const reservation = await Reservation.findOne({ _id: req.params.reservationId, 'hotel.owner': req.hotelOwner._id })
                                                 .populate('hotel')
                                                 .populate('guest', 'name email');
            if (!reservation) {
                return res.status(404).send('Reservation not found or you do not have permission to view it.');
            }
            res.json(reservation);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    updateReservationStatus: async (req, res) => {
        try {
            const { status } = req.body; // Expecting status in the request body
            const reservation = await Reservation.findOneAndUpdate(
                { _id: req.params.reservationId, 'hotel.owner': req.hotelOwner._id },
                { status },
                { new: true }
            );
            if (!reservation) {
                return res.status(404).send('Reservation not found or you do not have permission to update it.');
            }
            res.json(reservation);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
};

module.exports = ReservationController;
