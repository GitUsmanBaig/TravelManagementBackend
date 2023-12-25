require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Routes Imports
const TravelAgencyRouter = require("./TravelAgencyPanel/Routes/TravelAgencyRoutes");
const PackageRouter = require("./TravelAgencyPanel/Routes/PackagesRoutes");
const TravellerPanelRouter = require("./TravellerPanel/Routes/userRoutes");
const SuperAdminRouter = require("./SuperAdminPanel/Routes/adminRoutes");
const HotelOwnerRouter = require("./HotelOwnerPanel/Routes/hotelRoutes"); // Import Hotel Owner routes
const ReservationRouter = require("./HotelOwnerPanel/Routes/reservationRoutes"); // Import Reservation routes
const ReviewRouter = require("./HotelOwnerPanel/Routes/reviewRoutes"); // Import Review routes
const loginRouter = require("./HotelOwnerPanel/Routes/loginRoutes");

// Travel Agency Routes
app.use("/api/travel-agency", TravelAgencyRouter);
app.use("/api/package", PackageRouter);

// Super Admin Routes
app.use("/api/super-admin", SuperAdminRouter);

// Traveller Panel Routes
app.use("/user", TravellerPanelRouter);

// Hotel Owner Panel Routes
app.use("/api/hotel-owner", loginRouter); // Use login routes
app.use("/api/hotel-owner", HotelOwnerRouter); // Use Hotel Owner routes
app.use("/api/reservation", ReservationRouter); // Use Reservation routes
app.use("/api/review", ReviewRouter); // Use Review routes

// Database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error", err));

const port = process.env.PORT || 3000; // Default to 3000 if PORT is not in .env
app.listen(port, () => console.log(`Server listening on port ${port}`));
