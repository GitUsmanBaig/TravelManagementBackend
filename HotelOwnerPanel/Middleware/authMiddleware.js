const jwt = require("jsonwebtoken");
const HotelOwner = require("../../Schemas/HotelOwnerProfile.schema");
//const HotelOwner = require("D:/BS(SE)/Semester 5/Web Engineering/Project/TravelManagementBackend/Schemas/HotelOwnerProfile.schema");
const SECRET_KEY = process.env.SECRET_KEY; //for JWT (in .env file)

const authenticateHotelOwner = async (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const hotelOwner = await HotelOwner.findById(verified.id).select(
      "-password"
    );

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
