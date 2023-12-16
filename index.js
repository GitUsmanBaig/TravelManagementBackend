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

// Travel Agency Routes
app.use("/api/travel-agency", TravelAgencyRouter);

// Database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error", err));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on port ${port}`));
