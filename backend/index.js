import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Joi from "joi";
import joi from "joi-objectid";
import dotenv from "dotenv";
import users from "./routes/users.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.js";

dotenv.config();
const app = express();

Joi.objectId = joi(Joi);
mongoose
  .connect("mongodb://localhost/movierental")
  .then(() => console.log("Connected to Mongo DB..."))
  .catch((err) => console.log(err));

const allowedOrigins = [
  "http://localhost:5173", // your local frontend
  "https://mern-stack-movie-app.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", users);

app.use(errorHandler);

app.listen(3000, () => console.log("Listening to port 3000..."));
