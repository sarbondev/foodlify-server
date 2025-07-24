import { Request, Response } from "express";
import UserSchema from "../schemas/user.schema";

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await UserSchema.find()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error);

    }
}