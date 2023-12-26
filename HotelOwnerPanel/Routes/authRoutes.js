const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const HotelOwner = require("../../Schemas/HotelOwnerProfile.schema");
//const HotelOwner = require("D:/BS(SE)/Semester 5/Web Engineering/Project/TravelManagementBackend/Schemas/HotelOwnerProfile.schema.js");
const router = express.Router();


router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
      // Check if the user already exists
      let hotelOwner = await HotelOwner.findOne({ email });
      if (hotelOwner) {
          return res.status(400).send("Hotel owner already exists.");
      }

      // Create a new hotel owner object
      hotelOwner = new HotelOwner({
          name,
          email,
          password
      });

      // Hash password before saving the hotel owner
      //hotelOwner.password = await bcrypt.hash(password, 8);

      // Save the hotel owner
      await hotelOwner.save();

      // Generate a token
      const token = jwt.sign({ id: hotelOwner._id }, process.env.SECRET_KEY, {
          expiresIn: "1h"
      });

      res.status(201).json({ token });
  } catch (error) {
      res.status(500).send(error.message);
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hotelOwner = await HotelOwner.findOne({ email });
    if (!hotelOwner) {
      return res.status(401).send("Invalid email or password.");
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, hotelOwner.password);
    if (!isMatch) {
      //console output for error checking
      console.log(email, password, isMatch);
      return res.status(401).send("Invalid email or password.");
    }

    // Generate token
    const token = jwt.sign({ id: hotelOwner._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;
