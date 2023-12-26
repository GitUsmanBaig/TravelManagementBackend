const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const TravelAgency = require("../../Schemas/TravelAgency.schema");
const Package = require("../../Schemas/Package.schema");
const cloudinary = require("../../cloudinary");

const loginTravelAgency = async (req, res) => {
  const { email, password } = req.body;

  TravelAgency.findOne({ email, password })
    .then(data => {
      let token = null;
      if (data) {
        token = jwt.sign(
          {
            id: data._id,
            name: data.name,
            email: data.email,
          },
          "Secret to be replaced later"
        );
      }
      res
        .status(200)
        .json({ message: "Login successfull", token, id: data._id });
    })
    .catch(err => {
      res.status(400).json({ message: "Travel Agency not found" });
    });
};

const createTravelAgency = async (req, res) => {
  const { name, email, password, helplineNumber, image } = req.body;

  let logoUrl = null;
  // Cloudinary Uplaod
  try {
    logoUrl = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "TravelAgencyManagement",
        public_id: `${email}_logo`,
        folder: "TravelAgency",
        allowed_formats: ["jpg", "png", "jpeg", "svg", "ico", "webp", "jfif"],
      },
      function (error, result) {
        if (error) console.log(error);
        //console.log(result);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }

  if (logoUrl) logoUrl = logoUrl.secure_url;
  else res.status(500).json({ message: "Error uploading image" });

  TravelAgency.create({ name, email, password, helplineNumber, logoUrl })
    .then(data => {
      res
        .status(201)
        .send({ message: "Travel agency creation request added", data });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error adding requestion for creation fo Travel Agency",
        error: err,
      });
    });
};

const getAllTravelAgencies = async (req, res) => {
  TravelAgency.find()
    .then(data => {
      if (data) {
        res
          .status(200)
          .send({ message: "Travel agencies retrieved successfully", data });
      } else {
        res.status(404).send({ message: "No travel agencies found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving travel agencies", error: err });
    });
};

const getTravelAgencyById = async (req, res) => {
  const { id } = req.params;

  TravelAgency.findById(id)
    .then(data => {
      if (data) {
        res
          .status(200)
          .send({ message: "Travel agency retrieved successfully", data });
      } else {
        res.status(404).send({ message: "Travel agency not found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving travel agency", error: err });
    });
};

const getTravelAgencyPackagesById = async (req, res) => {
  const { id } = req.params;

  Package.find({ travelAgency: id })
    .then(data => {
      if (data) {
        res
          .status(200)
          .send({ message: "Packages retrieved successfully", data });
      } else {
        res.status(404).send({ message: "No packages found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving packages", error: err });
    });
};

const updateTravelAgency = async (req, res) => {
  const { name, email, helplineNumber, logoUrl } = req.body;

  TravelAgency.findByIdAndUpdate(
    req.body.signedInAgency.id,
    { name, email, helplineNumber, logoUrl },
    { new: true }
  )
    .then(data => {
      if (data) {
        res
          .status(200)
          .send({ message: "Travel agency updated successfully", data });
      } else {
        res.status(404).send({ message: "Travel agency not found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error updating travel agency", error: err });
    });
};

const deleteTravelAgency = async (req, res) => {
  TravelAgency.findByIdAndDelete(req.body.signedInAgency.id)
    .then(data => {
      if (data) {
        res
          .status(200)
          .send({ message: "Travel agency deleted successfully", data });
      } else {
        res.status(404).send({ message: "Travel agency not found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error deleting travel agency", error: err });
    });
};

module.exports = {
  loginTravelAgency,
  createTravelAgency,
  getAllTravelAgencies,
  getTravelAgencyById,
  getTravelAgencyPackagesById,
  updateTravelAgency,
  deleteTravelAgency,
};
