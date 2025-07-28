import express from "express"
import { signUp, signIn, getProfile } from "../controllers/auth.controller"
import { validateBody } from "../middlewares/validate"
import { authenticate } from "../middlewares/auth"
import { signUpSchema, signInSchema } from "../validators/auth.validator"

const router = express.Router()

router.post("/signup", validateBody(signUpSchema), signUp)
router.post("/signin", validateBody(signInSchema), signIn)
router.get("/profile", authenticate, getProfile)

export default router
