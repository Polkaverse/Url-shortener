const request = require("supertest");
const app = require("./server");

describe("URL Shortener API", () => {
  describe("POST /shorten", () => {
    it("should shorten a valid URL", async () => {
      const response = await request(app)
        .post("/shorten")
        .send({ url: "https://www.example.com" });

      expect(response.status).toBe(200);
      expect(response.body.shortcode).toBeDefined();
    });

    it("should return an error if URL is not provided", async () => {
      const response = await request(app).post("/shorten").send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("URL is required");
    });

    it("should return the same shortcode for the same URL", async () => {
      const firstResponse = await request(app)
        .post("/shorten")
        .send({ url: "https://www.example.com" });

      const secondResponse = await request(app)
        .post("/shorten")
        .send({ url: "https://www.example.com" });

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.shortcode).toBe(firstResponse.body.shortcode);
    });
  });

  describe("GET /metrics", () => {
    it("should return metrics", async () => {
      const response = await request(app).get("/metrics");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Object));
    });
  });
});
