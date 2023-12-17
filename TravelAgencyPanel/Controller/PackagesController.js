const Package = require("../../Schemas/Package.schema");

const createPackage = async (req, res) => {
  const {
    name,
    description,
    price,
    noOfPersons,
    startDate,
    endDate,
    isActive,
    imageUrl,
    otherImages,
    hotel,
    travelAgency,
    city,
  } = req.body;

  Package.create({
    name,
    description,
    price,
    noOfPersons,
    startDate,
    endDate,
    isActive,
    imageUrl,
    otherImages,
    hotel,
    travelAgency,
    city,
    disabled: false,
  })
    .then(data => {
      res.status(201).send({ message: "Package created successfully", data });
    })
    .catch(err => {
      res.status(500).send({ message: "Error creating package", error: err });
    });
};

const getAllPackages = async (req, res) => {
  Package.find({})
    .then(data => {
      res
        .status(200)
        .send({ message: "Packages retrieved successfully", data });
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving packages", error: err });
    });
};

const getPackageById = async (req, res) => {
  const { id } = req.params;

  Package.findById(id)
    .then(data => {
      res.status(200).send({ message: "Package retrieved successfully", data });
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving package", error: err });
    });
};

const updatePackageById = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    noOfPersons,
    startDate,
    endDate,
    isActive,
    imageUrl,
    otherImages,
    hotel,
    travelAgency,
    city,
  } = req.body;

  Package.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
      noOfPersons,
      startDate,
      endDate,
      isActive,
      imageUrl,
      otherImages,
      hotel,
      travelAgency,
      city,
    },
    { new: true }
  )
    .then(data => {
      res.status(200).send({ message: "Package updated successfully", data });
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating package", error: err });
    });
};

const deletePackageById = async (req, res) => {
  const { id } = req.params;

  Package.findByIdAndDelete(id)
    .then(data => {
      res.status(200).send({ message: "Package deleted successfully", data });
    })
    .catch(err => {
      res.status(500).send({ message: "Error deleting package", error: err });
    });
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
};
