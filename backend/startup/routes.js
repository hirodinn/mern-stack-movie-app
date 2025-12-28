import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import users from "../routes/users.js";
import cookieParser from "cookie-parser";
import errorHandler from "../middleware/error.js";

export default function (app) {
  // Security Middlewares
  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });

  // Apply the rate limiting middleware to all requests.
  app.use("/api", limiter);

  const allowedOrigins = [
    "http://localhost:5173",
    "https://mern-stack-movie-app.vercel.app", // keep this if valid
    process.env.ALLOWED_ORIGIN, // Add this for flexibility
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
