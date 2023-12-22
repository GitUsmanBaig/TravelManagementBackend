const TravelAgency = require("../../Schemas/TravelAgency.schema");

const loginTravelAgency = async (req, res) => {
  const { email, password } = req.body;

  TravelAgency.findOne({ email, password })
    .then(data => {
      if (data) {
        let token = jwt.sign(
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
  const { name, email, password, helplineNumber, logoUrl } = req.body;

  TravelAgency.create({ name, email, password, helplineNumber, logoUrl })
    .then(data => {
      res
        .status(201)
        .send({ message: "Travel agency creation request added", data });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error adding requestion for creation fo Travel Agency",
        error: err,
      });
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
  loginTravelAgency,
  createTravelAgency,
  getAllTravelAgencies,
  getTravelAgencyById,
  updateTravelAgency,
  deleteTravelAgency,
};
