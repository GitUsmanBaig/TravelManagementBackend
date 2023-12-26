//const Hotel = require('D:/BS(SE)/Semester 5/Web Engineering/Project/TravelManagementBackend/Schemas/Hotel.schema');
const Hotel = require("../../Schemas/Hotel.schema");
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
      const hotel = await Hotel.findOne({
        _id: req.params.id,
        owner: req.hotelOwner._id,
      });
      if (!hotel) return res.status(404).send("Hotel not found");
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
      if (!updatedHotel)
        return res.status(404).send("Hotel not found or not owned by you.");
      res.send(updatedHotel);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  deleteProperty: async (req, res) => {
    try {
      const hotel = await Hotel.findOneAndDelete({
        _id: req.params.id,
        owner: req.hotelOwner._id,
      });
      if (!hotel)
        return res.status(404).send("Hotel not found or not owned by you.");
      res.send({ message: "Hotel successfully deleted" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateRoomPricing: async (req, res) => {
    try {
      console.log("Hotel ID:", req.params.id);
      console.log("Room Type ID:", req.params.roomId);
  
      const hotel = await Hotel.findOne({
        _id: req.params.id,
        owner: req.hotelOwner._id,
      });
  
      console.log("Found hotel:", hotel);
  
      if (!hotel) return res.status(404).send("Hotel not found");
  
      const roomType = hotel.roomTypes.id(req.params.roomId);
      console.log("Found room type:", roomType);
  
      if (!roomType) return res.status(404).send("Room type not found");
  
      roomType.price = req.body.price;
      await hotel.save();
      res.json({ message: "Room pricing updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  

  updateAvailability: async (req, res) => {
    try {
      console.log("Hotel ID:", req.params.id);
      console.log("Room Type ID:", req.params.roomId);
  
      const hotel = await Hotel.findOne({
        _id: req.params.id,
        owner: req.hotelOwner._id,
      });
  
      console.log("Found hotel:", hotel);
  
      if (!hotel) return res.status(404).send("Hotel not found");
  
      const roomType = hotel.roomTypes.id(req.params.roomId);
      console.log("Found room type:", roomType);
  
      if (!roomType) return res.status(404).send("Room type not found");
  
      roomType.availability = req.body.newAvailability;
      await hotel.save();
      res.json({ message: "Room availability updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  

  updateBlackoutDates: async (req, res) => {
    try {
      console.log("Hotel ID:", req.params.id);
      console.log("Blackout Dates:", req.body.blackoutDates);
  
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        { $set: { blackoutDates: req.body.blackoutDates } },
        { new: true, runValidators: true }
      );
  
      console.log("Updated hotel:", hotel);
  
      if (!hotel) return res.status(404).send("Hotel not found or not owned by you.");
  
      res.json({ message: "Blackout dates updated successfully", blackoutDates: hotel.blackoutDates });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  

  addPromotion: async (req, res) => {
    try {
      console.log("Hotel ID:", req.params.id);
      console.log("New Promotion:", req.body);
  
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel || hotel.owner.toString() !== req.hotelOwner._id.toString()) {
        return res.status(404).send("Hotel not found or not owned by you.");
      }
  
      hotel.promotions.push(req.body); // Add new promotion
      await hotel.save();
      res.status(201).send({
        message: "Promotion added successfully",
        promotions: hotel.promotions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  

  listPromotions: async (req, res) => {
    try {
      console.log("Hotel ID:", req.params.id);
  
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel || hotel.owner.toString() !== req.hotelOwner._id.toString()) {
        return res.status(404).send("Hotel not found or not owned by you.");
      }
  
      res.json(hotel.promotions);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  

  updatePromotion: async (req, res) => {
    try {
      console.log("Hotel ID:", req.params.hotelId);
      console.log("Promotion ID:", req.params.promotionId);
      console.log("Updated Promotion Data:", req.body);
  
      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel || hotel.owner.toString() !== req.hotelOwner._id.toString()) {
        return res.status(404).send("Hotel not found or not owned by you.");
      }
  
      const promotion = hotel.promotions.id(req.params.promotionId);
      if (!promotion) {
        return res.status(404).send("Promotion not found.");
      }
  
      Object.assign(promotion, req.body); // Update the promotion details
      await hotel.save();
      res.send({ message: "Promotion updated successfully", promotion });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  

  deletePromotion: async (req, res) => {
    try {
      console.log("Hotel ID:", req.params.hotelId);
      console.log("Promotion ID to Delete:", req.params.promotionId);
  
      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel || hotel.owner.toString() !== req.hotelOwner._id.toString()) {
        return res.status(404).send("Hotel not found or not owned by you.");
      }
  
      // Find the index of the promotion to be removed
      const promotionIndex = hotel.promotions.findIndex(promotion => promotion._id.toString() === req.params.promotionId);
      if (promotionIndex === -1) {
        return res.status(404).send("Promotion not found.");
      }
  
      // Remove the promotion using splice
      hotel.promotions.splice(promotionIndex, 1);
      await hotel.save();
      res.send({ message: "Promotion deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  
  
};

module.exports = HotelController;
