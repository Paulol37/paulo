import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);
let db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // defaults to the DB in your URI
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error("❌ Database not connected. Call connectDB() first.");
  return db;
}
