const { selectAllUsers } = require("../models/users");

exports.getAllUsers = (req, res, next) => {
  return selectAllUsers()
    .then((users) => {
      return res.status(200).send({ users });
    })
    .catch(next);
};
