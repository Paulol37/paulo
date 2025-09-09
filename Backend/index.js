import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, getDB } from "./db.js"; 
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import employeeRoutes from "./routes/employees.js";
import { ObjectId } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("api/users", userRoutes);

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await connectDB(); // ✅ wait for DB before routes

    // ====== ROUTES ======
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/employees", employeeRoutes);

    // CRUD routes for "users"
    app.post("/api/user", async (req, res) => {
      try {
        const db = getDB(); // ✅ always grab db here
        const { name, email, address, age } = req.body;
        const result = await db.collection("users").insertOne({ name, email, address, age });
        res.status(201).json({ message: "User created", id: result.insertedId });
      } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
      }
    });

    app.get("/api/users", async (req, res) => {
      try {
        const db = getDB();
        const users = await db.collection("users").find().toArray();
        res.json(users);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
      }
    });

    app.get("/api/users/:id", async (req, res) => {
      try {
        const db = getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
      } catch {
        res.status(400).json({ error: "Invalid ID" });
      }
    });

    app.put("/api/users/:id", async (req, res) => {
      try {
        const db = getDB();
        const { id } = req.params;
        const updateData = req.body;
        const result = await db.collection("users").updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User updated successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.delete("/api/users/:id", async (req, res) => {
      try {
        const db = getDB();
        const { id } = req.params;
        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // ====== START SERVER ======
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        const newPort = Number(PORT) + 1;
        app.listen(newPort, () => {
          console.log(`⚡ Port ${PORT} in use, running instead on port ${newPort}`);
        });
      } else {
        console.error("Server error:", err);
      }
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
