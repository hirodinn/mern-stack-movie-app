/* eslint-disable no-undef */
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import logger from "../logger.js";
import { upload } from "../middleware/upload.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import client from "../startup/redis.js";

import { User, validateNewUser, validateOldUser } from "../model/user.js";

const route = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 */
route.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    let avatarUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      avatarUrl = result.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered",
      avatar: avatarUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Access denied
 */
route.get("/me", async (req, res) => {
  res.set({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  });
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access denied. No Token Provided!");
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  // 1. Check Cache
  const cacheKey = `user:${decoded._id}`;
  const cachedUser = await client.get(cacheKey);

  if (cachedUser) {
    return res.send(JSON.parse(cachedUser));
  }

  // 2. Fetch from DB
  const user = await User.findById(decoded._id).select("-password");

  // 3. Set Cache (Expiry: 1 hour = 3600 seconds)
  if (user) {
    await client.set(cacheKey, JSON.stringify(user), {
      EX: 3600,
    });
  }

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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Email or password error
 */
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

/**
 * @swagger
 * /api/users/favMovies:
 *   post:
 *     summary: Add or remove a movie from favorites
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user profile
 *       401:
 *         description: Access denied
 */
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

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 */
route.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/", // must match the path used when setting the cookie
  });

  res.json({ success: true, message: "Logged out successfully" });
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
route.put("/profile", upload.single("avatar"), async (req, res) => {
  try {
    // 1️⃣ AUTH
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ UPDATE NAME (OPTIONAL)
    if (req.body.name && req.body.name.length >= 5) {
      user.name = req.body.name;
    }

    // 3️⃣ UPDATE EMAIL (OPTIONAL + UNIQUE)
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = req.body.email;
    }

    // 4️⃣ UPDATE AVATAR (OPTIONAL)
    if (req.file) {
      try {
        if (user.avatar) {
          await deleteFromCloudinary(user.avatar);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        user.avatar = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // 5️⃣ SAVE
    await user.save();

    // 6️⃣ INVALIDATE CACHE
    const cacheKey = `user:${user._id}`;
    await client.del(cacheKey);

    res.json({
      success: true,
      user,
      message: "Profile Changed Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

export default route;
