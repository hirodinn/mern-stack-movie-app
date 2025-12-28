import mongoose from "mongoose";
import logger from "../logger.js";

export default function () {
  const db =
    process.env.NODE_ENV === "test"
      ? "mongodb://localhost/movierental_test"
      : process.env.MONGO_URI || "mongodb://localhost/movierental";

  mongoose
    .connect(db)
    .then(() => logger.info(`Connected to ${db}...`))
    .catch((err) => logger.error(err));
}
