const db = require("../db/connection");

exports.removeCommentById = async (comment_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [comment_id]
  );

  if (rows.length) {
    return db
      .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
        comment_id,
      ])
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
};
