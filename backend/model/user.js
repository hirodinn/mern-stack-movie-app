import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

export const User = mongoose.model("User", userSchema);

export function validateNewUser(obj) {
  const schema = Joi.object({
    name: Joi.string().required().min(5),
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
  });
  return schema.validate(obj || {});
}
export function validateOldUser(obj) {
  const schema = Joi.object({
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
  });
  return schema.validate(obj || {});
}
