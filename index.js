<<<<<<< HEAD
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser());
app.use(express.json());

// Database connection
mongoose.connect('mongodb+srv://abdullahdaniyal:superflies1234@cluster0.s5b7diq.mongodb.net/TravelManagement')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error', err));


const port = 3000;
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
=======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3000, () => {
  "Server is running...";
});

mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch(err => {
    console.log(err);
  });
>>>>>>> d4c72f9952e9c525ade5ab3a8ccfc01ac3f02095
