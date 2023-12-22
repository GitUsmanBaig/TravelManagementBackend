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

router.post("/login", loginTravelAgency);
router.post("/", createTravelAgency);
router.get("/", getAllTravelAgencies);
router.get("/:id", getTravelAgencyById);
router.put("/:id", updateTravelAgency);
router.delete("/:id", deleteTravelAgency);

module.exports = router;
