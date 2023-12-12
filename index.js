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
