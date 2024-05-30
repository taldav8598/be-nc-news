const express = require("express");

const { getAllTopics } = require("./controllers/topics.controllers");
const { getAllEndpoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleGeneric404Errors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", handleGeneric404Errors);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
