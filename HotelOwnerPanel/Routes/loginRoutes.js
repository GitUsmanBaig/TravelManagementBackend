const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const HotelOwner = require("../../Schemas/HotelOwnerProfile.schema");
//const HotelOwner = require("D:/BS(SE)/Semester 5/Web Engineering/Project/TravelManagementBackend/Schemas/HotelOwnerProfile.schema.js");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hotelOwner = await HotelOwner.findOne({ email });
    if (!hotelOwner) {
      return res.status(401).send("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, hotelOwner.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password.");
    }

    const token = jwt.sign({ id: hotelOwner._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
