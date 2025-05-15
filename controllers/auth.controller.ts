import { Request, Response } from "express";

export async function signUp(req: Request, res: Response) {
  try {
    res.status(200).json({ message: "User created", user: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
