/* eslint-disable no-undef */
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import logger from "../logger.js";
import { upload } from "../middleware/upload.js";

import { User, validateNewUser, validateOldUser } from "../model/user.js";

const route = express.Router();

route.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const { error } = validateNewUser(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    let avatarPath = "";
    if (req.file) {
      const uploadsDir = path.join("uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const filename = Date.now() + path.extname(req.file.originalname);
      avatarPath = `/uploads/${filename}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      favMovies: req.body.favMovies,
      avatar: avatarPath,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.getAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await user.save();

    res.json({
      success: true,
      message: `Register successful, Welcome ${user.name}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

route.get("/me", async (req, res) => {
  res.set({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  });
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access denied. No Token Provided!");
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await User.findById(decoded._id).select("-password");
  logger.info({
    message: "Fetched logged-in user info",
    userId: user?._id || null,
    email: user?.email || null,
    route: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  res.send(user);
});

route.post("/login", async (req, res) => {
  const { error } = validateOldUser(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "email or password error" });
  const isValid = await bcrypt.compare(req.body.password, user.password);
  const token = user.getAuthToken();
  if (isValid) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      message: `Login successful, Welcome ${user.name}`,
    });
  } else
    res
      .status(404)
      .json({ success: false, message: "email or password error" });
});

route.post("/favMovies", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access denied. No Token Provided!");
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
    await user.save();
    res.send(user);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

route.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/", // must match the path used when setting the cookie
  });

  res.json({ success: true, message: "Logged out successfully" });
});

route.put("/", async (req, res) => {
  res.set({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  });
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access denied. No Token Provided!");
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await User.findById(decoded._id).select("-password");
  user.name = req.body.name;
  await user.save();
  res.send(user);
});

route.put("/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const token = req.cookies.token;
    if (!token)
      return res.status(401).send("Access denied. No Token Provided!");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar) {
      const oldPath = path.join(".", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const uploadsDir = "uploads";
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const filename = Date.now() + path.extname(req.file.originalname);
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    user.avatar = `/uploads/${filename}`;
    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Avatar update failed" });
  }
});

export default route;
