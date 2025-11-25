import express from "express";
import { User, validateOldUser } from "../model/user.js";

const route = express.Router();

route.post("/login", async (req, res) => {
  console.log("this is called");

  console.log(req.body);
  const { error } = validateOldUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );
    if (user) res.send(user);
    else res.status(404).send("email or password error");
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

export default route;
