\c nc_news_test

SELECT * FROM topics;

SELECT * FROM users;

SELECT * FROM articles;

SELECT * FROM comments;

SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.body) + COUNT(articles.body) as comment_count FROM articles
INNER JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id, comments.article_id ORDER BY articles.created_at DESC;