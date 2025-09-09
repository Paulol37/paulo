import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../db.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const db = getDB(); // ✅ call inside route
    const { email, password } = req.body;

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const result = await db.collection("users").insertOne({ email, password: hashedPassword });

    res.status(201).json({ message: "User registered", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const db = getDB(); // ✅ call inside route
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
