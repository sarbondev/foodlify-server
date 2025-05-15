import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Foodlify API serveriga xush kelibsiz!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
