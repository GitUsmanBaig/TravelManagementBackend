const express = require("express");
const Hotel = require("../../Schemas/Hotel.schema");

const router = express.Router();

router.get("/", (req, res) => {
  Hotel.find({})
    .populate("owner", "name")
    .then(data => {
      if (data) {
        res.status(200).json({ message: "Hotel Found", data });
      } else {
        res.status(404).json({ message: "No hotels found", err });
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message, err });
    });
});

module.exports = router;
