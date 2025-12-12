import dotenv from "dotenv";
import Joi from "joi";
import joi from "joi-objectid";
export default function () {
  dotenv.config();
  Joi.objectId = joi(Joi);
}
