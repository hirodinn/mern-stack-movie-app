import cors from "cors";
import users from "./routes/users.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.js";
export default function (app) {
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
}
