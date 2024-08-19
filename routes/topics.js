const express = require("express");

const { getAllTopics } = require("../controllers/topics.controllers");

const router = express.Router();

router.get("/", getAllTopics);

module.exports = router;
