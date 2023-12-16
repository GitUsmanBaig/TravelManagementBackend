const TravelAgency = require("../../Schemas/TravelAgency.schema");

const createTravelAgency = async (req, res) => {
  const { name, email, helplineNumber, logoUrl } = req.body;

  TravelAgency.create({ name, email, helplineNumber, logoUrl })
    .then(data => {
      res
        .status(201)
        .send({ message: "Travel agency created successfully", data });
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error creating travel agency", error: err });
    });
};

const getAllTravelAgencies = async (req, res) => {
  TravelAgency.find()
    .then(data => {
      res
        .status(200)
        .send({ message: "Travel agencies retrieved successfully", data });
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
      res
        .status(200)
        .send({ message: "Travel agency retrieved successfully", data });
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving travel agency", error: err });
    });
};

const updateTravelAgency = async (req, res) => {
  const { id } = req.params;
  const { name, email, helplineNumber, logoUrl } = req.body;

  TravelAgency.findByIdAndUpdate(
    id,
    { name, email, helplineNumber, logoUrl },
    { new: true }
  )
    .then(data => {
      res
        .status(200)
        .send({ message: "Travel agency updated successfully", data });
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error updating travel agency", error: err });
    });
};

const deleteTravelAgency = async (req, res) => {
  const { id } = req.params;

  TravelAgency.findByIdAndDelete(id)
    .then(data => {
      res
        .status(200)
        .send({ message: "Travel agency deleted successfully", data });
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error deleting travel agency", error: err });
    });
};

module.exports = {
  createTravelAgency,
  getAllTravelAgencies,
  getTravelAgencyById,
  updateTravelAgency,
  deleteTravelAgency,
};
