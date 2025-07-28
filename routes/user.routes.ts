import express from "express"
import { getAllUsers, getUserById, updateUser, deleteUser, toggleUserStatus } from "../controllers/user.controller"
import { authenticate, authorize } from "../middlewares/auth"
import { validateBody } from "../middlewares/validate"
import { UserValidator } from "../validators/user-validator"

const router = express.Router()

// All user routes require authentication
router.use(authenticate)

router.get("/", authorize(["admin"]), getAllUsers)
router.get("/:id", authorize(["admin"]), getUserById)
router.put("/:id", authorize(["admin"]), validateBody(UserValidator), updateUser)
router.delete("/:id", authorize(["admin"]), deleteUser)
router.patch("/:id/toggle-status", authorize(["admin"]), toggleUserStatus)

export default router
