const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
} = require("../Controller/PackagesController");

const express = require("express");
const router = express.Router();

router.post("/", createPackage);
router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.put("/:id", updatePackageById);
router.delete("/:id", deletePackageById);

module.exports = router;
