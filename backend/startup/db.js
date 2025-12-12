import mongoose from "mongoose";

export default function () {
  mongoose
    .connect("mongodb://localhost/movierental")
    .then(() => console.log("Connected to Mongo DB..."))
    .catch((err) => console.log(err));
}
