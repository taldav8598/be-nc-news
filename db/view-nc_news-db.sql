\c nc_news

SELECT * FROM topics;

SELECT * FROM users;

SELECT * FROM articles;

SELECT * FROM comments;

SELECT articles.*, COUNT(comments.body) 
AS comment_count 
FROM comments 
INNER JOIN articles 
ON comments.article_id = articles.article_id 
WHERE articles.article_id = 34 
GROUP BY articles.article_id;

