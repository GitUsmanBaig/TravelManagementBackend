const {
  loginTravelAgency,
  createTravelAgency,
  getAllTravelAgencies,
  getTravelAgencyById,
  updateTravelAgency,
  deleteTravelAgency,
} = require("../Controller/TravelAgencyController");

const express = require("express");
const router = express.Router();

const AuthenticateTravelAgency = require("../Middleware/AuthenticateTravelAgency");

router.post("/login", loginTravelAgency);
router.post("/", createTravelAgency);
router.get("/", getAllTravelAgencies);
router.get("/:id", getTravelAgencyById);
router.put("/", AuthenticateTravelAgency, updateTravelAgency);
router.delete("/", AuthenticateTravelAgency, deleteTravelAgency);

module.exports = router;
