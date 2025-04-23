import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
