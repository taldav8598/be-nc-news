const express = require("express");

const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handleGeneric404Errors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.get("/api/topics", getAllTopics);

app.all("*", handleGeneric404Errors);

app.use(handleServerErrors);

module.exports = app;
