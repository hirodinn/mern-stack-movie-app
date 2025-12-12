import express from "express";
import cors from "cors";
import Joi from "joi";
import joi from "joi-objectid";
import dotenv from "dotenv";
import users from "./routes/users.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.js";

dotenv.config();
const app = express();

// exception for winston to handle it
/*
const p = Promise.reject(new Error("unhandled rejection"));
p.then(() => console.log("done"));
*/

//error for winston to catch it
/*
throw new Error('Unhandeled Error')
*/

Joi.objectId = joi(Joi);

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
