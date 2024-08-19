const express = require("express");

const {
  getArticleById,
  getAllArticles,
  getArticleCommentsById,
  postNewArticleCommentById,
  patchArticleNewVotesById,
} = require("../controllers/articles.controllers");

const router = express.Router();

router.get("/", getAllArticles);

router.get("/:article_id", getArticleById);

router.get("/:article_id/comments", getArticleCommentsById);

router.post("/:article_id/comments", postNewArticleCommentById);

router.patch("/:article_id/comments", patchArticleNewVotesById);

module.exports = router;
