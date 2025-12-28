import dotenv from "dotenv";
import Joi from "joi";
import joi from "joi-objectid";
export default function () {
  dotenv.config();

  const requiredEnvVars = ["JWT_KEY", "MONGO_URI"];
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `FATAL ERROR: The following environment variables are missing: ${missing.join(
        ", "
      )}`
    );
  }

  Joi.objectId = joi(Joi);
}
