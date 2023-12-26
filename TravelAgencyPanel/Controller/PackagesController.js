const Package = require("../../Schemas/Package.schema");
const TravelAgency = require("../../Schemas/TravelAgency.schema");
const cloudinary = require("../../cloudinary");

const createPackage = async (req, res) => {
  const {
    name,
    description,
    price,
    noOfPersons,
    startDate,
    endDate,
    isActive,
    image,
    //otherFacilites,
    hotel,
    city,
    totalAmount,
    packageCategory,
  } = req.body;

  //console.log(hotel);
  const otherFacilites = req.body.otherFacilites.split(",");

  const travelAgency = req.body.signedInAgency.id;

  let imageUrl = null;
  // Cloudinary Uplaod
  try {
    imageUrl = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "TravelAgencyManagement",
        public_id: `${name}+${city}+${travelAgency}_logo`,
        folder: "Packages",
        allowed_formats: ["jpg", "png", "jpeg", "svg", "ico", "webp", "jfif"],
      },
      function (error, result) {
        if (error) console.log(error);
        //console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading image", error });
    return;
  }

  if (imageUrl) imageUrl = imageUrl.secure_url;
  //else res.status(500).json({ message: "Error uploading image" });

  try {
    const newPackage = await Package.create({
      name,
      description,
      price,
      noOfPersons,
      startDate,
      endDate,
      isActive,
      imageUrl,
      otherFacilites,
      hotel,
      travelAgency,
      city,
      totalAmount,
      packageCategory,
      disabled: false, // Assuming default value for disabled
    });

    // Increment noOfPackages for the associated TravelAgency
    await TravelAgency.findByIdAndUpdate(travelAgency, {
      $inc: { noOfPackages: 1 },
    });

    res
      .status(201)
      .send({ message: "Package created successfully", data: newPackage });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error creating package", error: err });
  }
};

const getAllPackages = async (req, res) => {
  Package.find({})
    .populate("hotel", "name")
    .populate("travelAgency", "name")
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

const getPackageById = async (req, res) => {
  const { id } = req.params;

  Package.findById(id)
    .populate("hotel", "name")
    .populate("travelAgency", "name")
    .then(data => {
      if (data) {
        res
          .status(200)
          .send({ message: "Package retrieved successfully", data });
      } else {
        res.status(404).send({ message: "Package not found" });
      }
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
    otherFacilites,
    hotel,
    city,
  } = req.body;

  const travelAgency = req.body.signedInAgency.id;

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
      otherFacilites,
      hotel,
      travelAgency,
      city,
    },
    { new: true }
  )
    .then(data => {
      if (data) {
        res.status(200).send({ message: "Package updated successfully", data });
      } else {
        res.status(400).send({ message: "Package not found" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating package", error: err });
    });
};

const deletePackageById = async (req, res) => {
  const { id } = req.params;

  try {
    const packageToDelete = await Package.findById(id);
    if (!packageToDelete) {
      return res.status(404).send({ message: "Package not found" });
    }

    await Package.findByIdAndDelete(id);

    // Decrement noOfPackages for the associated TravelAgency
    await TravelAgency.findByIdAndUpdate(packageToDelete.travelAgency, {
      $inc: { noOfPackages: -1 },
    });

    res.status(200).send({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting package", error: err });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
};
