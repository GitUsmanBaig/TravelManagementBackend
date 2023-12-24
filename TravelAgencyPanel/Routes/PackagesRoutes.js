const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
} = require("../Controller/PackagesController");
const authenticateTravelAgency = require("../Middleware/AuthenticateTravelAgency");

const express = require("express");
const VerifyTravelAgency = require("../Middleware/VerifyTravelAgency");
const router = express.Router();

router.post("/", authenticateTravelAgency, createPackage);
router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.put(
  "/:id",
  authenticateTravelAgency,
  VerifyTravelAgency,
  updatePackageById
);
router.delete(
  "/:id",
  authenticateTravelAgency,
  VerifyTravelAgency,
  deletePackageById
);

module.exports = router;
