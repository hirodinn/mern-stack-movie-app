import request from "supertest";
import app from "../../app.js";
import { User } from "../../model/user.js";
import mongoose from "mongoose";
import redisClient from "../../startup/redis.js";

describe("GET /api/users/me", () => {
  beforeEach(async () => {
    // Cleanup before each test if needed
  });

  afterAll(async () => {
    await mongoose.connection.close();
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
  });
});
