const {
  selectArticleById,
  selectAllArticles,
  selectArticleCommentsById,
  createNewArticleCommentById,
} = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  return selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postNewArticleCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const requestBody = req.body;

  return createNewArticleCommentById(article_id, requestBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
