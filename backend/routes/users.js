/* eslint-disable no-undef */
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User, validateNewUser, validateOldUser } from "../model/user.js";

const route = express.Router();

route.post("/", async (req, res) => {
  const { error } = validateNewUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      favMovies: req.body.favMovies,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(user);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

route.get("/me", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No Token Provided!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("decoded");
    const user = await User.findById(decoded._id).select("-password");
    res.send(user);
  } catch {
    res.status(400).send("Invalid token");
  }
});

route.post("/login", async (req, res) => {
  const { error } = validateOldUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("email or password error");
    const isValid = await bcrypt.compare(req.body.password, user.password);
    const token = user.getAuthToken();
    if (isValid) res.send(token);
    else res.status(404).send("email or password error");
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

route.delete("/", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No Token Provided!");
  try {
    const id = jwt.verify(token, process.env.JWT_KEY)._id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send("can't find the user with ID");
    const modifiedFav = user.favMovies.filter(
      (fav) => fav !== req.body.movieId
    );
    user.favMovies = modifiedFav;
    await user.save();
    res.send(user);
    console.log(user);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

route.post("/favMovies", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No Token Provided!");
  console.log(req.body);
  try {
    const id = jwt.verify(token, process.env.JWT_KEY)._id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send("can't find the user with ID");
    if (user.favMovies.includes(req.body.movieId)) {
      const modifiedFav = user.favMovies.filter(
        (fav) => fav !== req.body.movieId
      );
      user.favMovies = modifiedFav;
    } else {
      user.favMovies.push(req.body.movieId);
    }
    console.log(user);
    await user.save();
    res.send(user);
    console.log(user);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

export default route;
