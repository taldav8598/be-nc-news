const express = require("express");

const { getAllEndpoints } = require("../controllers/api.controllers");

const articles = require("./articles");
const comments = require("./comments");
// const topics = require("./topics");
// const users = require("./users");

const router = express.Router();

router.get("/", getAllEndpoints);

router.use("/articles", articles);
router.use("/comments", comments);
// router.use("/topics", topics);
// router.use("/users", users);

module.exports = router;
