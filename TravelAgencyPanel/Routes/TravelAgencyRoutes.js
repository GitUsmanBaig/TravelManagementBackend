const {
  loginTravelAgency,
  createTravelAgency,
  getAllTravelAgencies,
  getTravelAgencyById,
  getTravelAgencyPackagesById,
  updateTravelAgency,
  deleteTravelAgency,
  getTravelAgencyBookingsById,
} = require("../Controller/TravelAgencyController");

const express = require("express");
const router = express.Router();

const AuthenticateTravelAgency = require("../Middleware/AuthenticateTravelAgency");

router.get("/bookings", AuthenticateTravelAgency, getTravelAgencyBookingsById);
router.post("/login", loginTravelAgency);
router.post("/", createTravelAgency);
router.get("/", getAllTravelAgencies);
router.get("/:id", getTravelAgencyById);
router.get("/:id/packages", getTravelAgencyPackagesById);
router.put("/", AuthenticateTravelAgency, updateTravelAgency);
router.delete("/", AuthenticateTravelAgency, deleteTravelAgency);

module.exports = router;
