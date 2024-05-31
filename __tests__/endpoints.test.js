const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointsJson = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });

  test("404: responds with a 'Not Found' message when an incorrect path is provided", () => {
    return request(app)
      .get("/api/topi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toMatchObject(endpointsJson);
      });
  });
});

describe("GET /api/articles/article_id", () => {
  test("200: responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: responds with a 'Not Found' error message if the id is invalid", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: responds with a 'Bad Request' error message if the id does not exist", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an article array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: responds with an article array of article objects sorted by date 'created_at' in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("404: responds with a 'Not Found' error message if the route is invalid", () => {
    return request(app)
      .get("/api/articl")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of all comments for the specified article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("404: responds with a 'Not Found' error message if the id is invalid", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: responds with a 'Bad Request' error message if the id does not exist", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with an object containing the posted comment", () => {
    const userComment = {
      username: "lurker",
      body: "Hello world",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(userComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          username: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test("400: responds with a 'Bad Request' message when provided a malformed userComment/userComment missing required fields", () => {
    const userComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(userComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: responds with a 'Bad Request' when provided an object that fails schema validation", () => {
    const userComment = { username: 1, body: 2 };
    return request(app)
      .post("/api/articles/1/comments")
      .send(userComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("PATCH /api/articles/:article_id/comments", () => {
  test("200: responds with an updated article object", () => {
    const newVotes = {
      inc_votes: 100,
    };
    return request(app)
      .patch("/api/articles/1/comments")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: responds with a 'Bad Request' message when provided a malformed newVotes/newVotes missing required fields", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/articles/1/comments")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: responds with a 'Bad Request' when provided an object that fails schema validation", () => {
    const newVotes = { inc_votes: NaN };
    return request(app)
      .patch("/api/articles/1/comments")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/articles/:article_id/comments", () => {
  test("204: responds with a no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: responds with 'Not Found' error message", () => {
    return request(app)
      .delete("/api/comments/999999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: responds with 'Bad Request' error message", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)

      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds with a 'Not Found' message when an incorrect path is provided", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles?topic", () => {
  test("200: responds with an array of objects containing the provided topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("400: responds with 'Bad Request' error message", () => {
    return request(app)
      .get("/api/articles?not_a_topic=helloWorld")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
