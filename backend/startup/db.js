import mongoose from "mongoose";
import logger from "../logger.js";

export default function () {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost/movierental")
    .then(() => logger.info("Connected to Mongo DB..."))
    .catch((err) => logger.error(err));
}
