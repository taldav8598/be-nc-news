const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  console.log("seeding!");
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
      .get("/api/topics/not-a-route")
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

        expect(typeof endpoints).toBe("object");
        expect(Array.isArray(endpoints)).toBe(false);

        const endpointKeyValueArr = Object.entries(endpoints);
        endpointKeyValueArr.forEach((routeObj, index) => {
          const [exampleResponseChildKey] = Object.keys(
            routeObj[1].exampleResponse
          );

          expect(typeof routeObj[0]).toBe("string"),
            expect(routeObj[1]).toMatchObject({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: {
                [exampleResponseChildKey]: expect.any(Array),
              },
            });
        });
      });
  });
});
