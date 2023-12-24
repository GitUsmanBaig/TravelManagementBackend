const jwt = require("jsonwebtoken");
const TravelAgency = require("../../Schemas/TravelAgency.schema");

let AuthenticateTravelAgency = async (req, res, next) => {
  let token = req.headers.token;

  try {
    let { id, name, email } = await jwt.verify(
      token,
      "Secret to be replaced later"
    );

    TravelAgency.findById(id)
      .then(data => {
        if (data.accepted === "Rejected")
          res
            .status(403)
            .json({ message: "Your account creation request is rejected" });
        else if (data.accepted === "Pending")
          res
            .status(403)
            .json({ message: "Your account creation request is pending" });
        else {
          if (id && name && email) {
            req.body.signedInAgency = {};
            req.body.signedInAgency.id = id;
            // req.body.signedInAgency.name = name;
            // req.body.signedInAgency.email = email;
            next();
          } else {
            res.status(404).json({ Message: "Your Are Not Authenticated" });
          }
        }
      })
      .catch(err => res.status(500).send(err));
  } catch (err) {
    res.status(404).json({ Message: "Your Are Not Authenticated", err });
  }
};

module.exports = AuthenticateTravelAgency;
