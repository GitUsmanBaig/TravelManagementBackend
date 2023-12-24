const Package = require("../../Schemas/Package.schema");

let VerifyTravelAgency = async (req, res, next) => {
  let { id } = req.params;

  Package.findById(id)
    .then(data => {
      data.travelAgency.toString() === req.body.signedInAgency.id
        ? next()
        : res.status(403).json({ Message: "You Are Not Authorized" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = VerifyTravelAgency;
