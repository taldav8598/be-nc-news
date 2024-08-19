const express = require("express");
const cors = require("cors");

const api = require("./routes/api");

const { getAllTopics } = require("./controllers/topics.controllers");
const { getAllUsers } = require("./controllers/users.controllers");

const { deleteCommentById } = require("./controllers/comments.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleGeneric404Errors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", api);

app.get("/api/topics", getAllTopics);

app.get("/api/users", getAllUsers);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", handleGeneric404Errors);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
