const jwt = require("jsonwebtoken");
const HotelOwner = require("../../Schemas/HotelOwnerProfile.schema");
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateHotelOwner = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const hotelOwner = await HotelOwner.findById(verified.id).select("-password");

    //console.log(hotelOwner);

    if (!hotelOwner) {
      throw new Error("The user no longer exists.");
    }

    req.hotelOwner = hotelOwner;
    next();
  } catch (err) {
    res.status(400).send("Invalid token. Please log in again.");
  }
};

module.exports = { authenticateHotelOwner };
