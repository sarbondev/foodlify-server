import express from "express";
import { signUp } from "../controllers/auth.controller";
import superAdminSchema from "../schemas/super-admin.schema";
import { validateBody } from "../middlewares/validate";

const router = express.Router();

router.post("/register", validateBody(superAdminSchema), signUp);

export default router;
