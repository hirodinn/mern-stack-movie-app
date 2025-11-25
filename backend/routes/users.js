import express from "express";
import bcrypt from "bcrypt";
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

route.post("/login", async (req, res) => {
  const { error } = validateOldUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("email or password error");
    const isValid = await bcrypt.compare(req.body.password, user.password);
    const userNoP = {
      name: user.name,
      id: user._id,
      email: user.email,
      favMovies: user.favMovies,
    };
    if (isValid) res.send(userNoP);
    else res.status(404).send("email or password error");
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("can't find the user with ID");
    const modifiedFav = user.favMovies.filter(
      (fav) => fav !== req.body.movieId
    );
    user.favMovies = modifiedFav;
    await user.save();
    res.send(user);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

export default route;
