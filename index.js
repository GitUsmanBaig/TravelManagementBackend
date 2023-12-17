require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes Imports
const TravelAgencyRouter = require("./TravelAgencyPanel/Routes/TravelAgencyRoutes");
<<<<<<< HEAD
const SuperAdminRouter = require("./SuperAdminPanel/Routes/adminRoutes");

=======
const TravellerPanelRouter = require("./TravellerPanel/Routes/userRoutes");
>>>>>>> f9bc65c64df9440d1bf0d643789fe64fc90ad04e

// Travel Agency Routes
app.use("/api/travel-agency", TravelAgencyRouter);
//superAdmin Routes
app.use("/api/super-admin", SuperAdminRouter);

//Traveller Panel Routes
app.use("/user", TravellerPanelRouter);

// Database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error", err));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on port ${port}`));
