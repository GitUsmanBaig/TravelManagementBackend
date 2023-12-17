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
const PackageRouter = require("./TravelAgencyPanel/Routes/PackagesRoutes");
const TravellerPanelRouter = require("./TravellerPanel/Routes/userRoutes");
const SuperAdminRouter = require("./SuperAdminPanel/Routes/adminRoutes");

// Travel Agency Routes
app.use("/api/travel-agency", TravelAgencyRouter);
app.use("/api/package", PackageRouter);

// // temp
// const { addHotel } = require("./dummyData");
// app.post("/api/addHotel", addHotel);
// //
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
