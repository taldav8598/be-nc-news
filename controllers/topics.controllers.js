const { selectAllTopics } = require("../models/topics");

exports.getAllTopics = (req, res, next) => {
  return selectAllTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};
