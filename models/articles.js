const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows[0];
      }
    });
};

exports.selectAllArticles = (query) => {
  const { topic } = query;

  const keys = Object.keys(query);

  const isTopicQueryOrBaseUrl =
    keys.length === 0 || keys.filter((item) => item === "topic").length > 0;

  if (!isTopicQueryOrBaseUrl) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryValues = [];
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
      COUNT(comments.body) + COUNT(articles.body) as comment_count FROM articles 
      INNER JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id, comments.article_id ORDER BY articles.created_at DESC;`;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleCommentsById = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows;
      }
    });
};

exports.createNewArticleCommentById = async (article_id, requestBody) => {
  const { username, body } = requestBody;

  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const articleExists = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  const userExists = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  if (articleExists && userExists) {
    return db
      .query(
        `WITH inserted_comment as (INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *) 
        SELECT users.username, body FROM inserted_comment
        JOIN users ON users.username = inserted_comment.author`,
        [article_id, username, body]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};

exports.updateArticleNewVotesById = async (article_id, requestBody) => {
  const { inc_votes } = requestBody;

  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const article = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  if (article.rows.length) {
    return db
      .query(
        `UPDATE articles 
      SET votes = votes + $2 
      WHERE article_id = $1 
      RETURNING *;`,
        [article_id, inc_votes]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};
