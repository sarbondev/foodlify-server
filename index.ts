import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import RootRoutes from './routes/root.routes'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    message: "Foodlify API is running!",
    status: "OK",
    time: new Date().toISOString(),
    endpoints: {
      user: "/api/user",
    },
  });
});

app.use("/api", RootRoutes);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI


if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB database");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🔗 API Documentation: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ Failed to connect to database:", error.message);
    process.exit(1);
  });