import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Joi from "joi";
import joi from "joi-objectid";
import users from "./routes/users.js";
const app = express();

Joi.objectId = joi(Joi);
mongoose
  .connect("mongodb://localhost/movierental")
  .then(() => console.log("Connected to Mongo DB..."))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/users", users);

app.listen(3000, () => console.log("Listening to port 3000..."));
