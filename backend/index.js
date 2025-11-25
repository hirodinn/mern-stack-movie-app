import express from "express";
import mongoose from "mongoose";
import users from "./routes/users.js";
const app = express();

mongoose
  .connect("mongodb://localhost/movierental")
  .then(() => console.log("Connected to Mongo DB..."))
  .catch((err) => console.log(err));

app.use("/api/users", users);

app.listen(3000, () => console.log("Listening to port 3000..."));
