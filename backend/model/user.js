import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

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
  favMovies: {
    type: Array,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
});

userSchema.methods.getAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, favMovies: this.favMovies },
    // eslint-disable-next-line no-undef
    process.env.JWT_KEY
  );
  return token;
};

export const User = mongoose.model("User", userSchema);

export function validateNewUser(obj) {
  const schema = Joi.object({
    name: Joi.string().required().min(5),
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
    favMovies: Joi.array(),
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

export function validateId(id) {
  const schema = Joi.object({
    id: Joi.objectId().required(),
  });
  return schema.validate({ id });
}
