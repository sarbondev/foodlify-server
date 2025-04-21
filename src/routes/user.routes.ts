import express, { Request, Response } from "express";

const router = express.Router();

const users = ["Suhrob"];

router.get("/", (req: Request, res: Response) => {
  res.send(users);
});

export default router;
