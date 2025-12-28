import mongoose from "mongoose";
import logger from "../logger.js";

export default function () {
  const db =
    process.env.NODE_ENV === "test"
      ? process.env.MONGO_URI_TEST || "mongodb://localhost/movierental_test"
      : process.env.MONGO_URI || "mongodb://localhost/movierental";

  mongoose
    .connect(db)
    .then(() => logger.info(`Connected to ${db}...`))
    .catch((err) => {
      logger.error(`Could not connect to MongoDB at ${db}...`, err.message);
    });
}
