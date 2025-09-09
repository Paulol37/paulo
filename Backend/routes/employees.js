import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = express.Router();

// CREATE employee
router.post("/", async (req, res) => {
  try {
    const db = getDB(); // ✅ call here
    const { name, role, salary } = req.body;
    const result = await db.collection("employees").insertOne({ name, role, salary });
    res.status(201).json({ message: "Employee created", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all employees
router.get("/", async (req, res) => {
  try {
    const db = getDB(); // ✅
    const employees = await db.collection("employees").find().toArray();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// READ single employee
router.get("/:id", async (req, res) => {
  try {
    const db = getDB(); // ✅
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(req.params.id) });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// UPDATE employee
router.put("/:id", async (req, res) => {
  try {
    const db = getDB(); // ✅
    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB(); // ✅
    const result = await db.collection("employees").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
