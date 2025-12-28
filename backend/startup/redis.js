import { createClient } from "redis";
import logger from "../logger.js";

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => {
  logger.error("Redis Client Error:", err.message);
});

client.on("connect", () => {
  logger.info("Connected to Redis...");
});

// Connect non-blockingly to allow app to start even if Redis is down
client
  .connect()
  .catch((err) =>
    logger.warn("Redis failed to connect initially. Check if it is running.")
  );

export default client;
