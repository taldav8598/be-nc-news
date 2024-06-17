const express = require("express");
const cors = require("cors");

const { getAllTopics } = require("./controllers/topics.controllers");
const { getAllEndpoints } = require("./controllers/api.controllers");
const { getAllUsers } = require("./controllers/users.controllers");
const {
  getArticleById,
  getAllArticles,
  getArticleCommentsById,
  postNewArticleCommentById,
  patchArticleNewVotesById,
} = require("./controllers/articles.controllers");
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

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.post("/api/articles/:article_id/comments", postNewArticleCommentById);

app.patch("/api/articles/:article_id/comments", patchArticleNewVotesById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", handleGeneric404Errors);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
