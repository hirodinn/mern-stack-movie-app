import express from "express";
import cors from "cors";
import users from "../routes/users.js";
import cookieParser from "cookie-parser";
import errorHandler from "../middleware/error.js";
export default function (app) {
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
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use("/uploads", express.static("uploads"));
  app.use("/api/users", users);

  app.use(errorHandler);
}
