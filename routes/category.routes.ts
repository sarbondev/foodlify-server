import express from "express"
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller"
import { authenticate, authorize } from "../middlewares/auth"
import { validateBody } from "../middlewares/validate"
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator"

const router = express.Router()

// Public routes
router.get("/", getAllCategories)
router.get("/:id", getCategoryById)
router.get("/slug/:slug", getCategoryBySlug)

// Protected routes (admin only)
router.post("/", authenticate, authorize(["admin"]), validateBody(createCategorySchema), createCategory)
router.put("/:id", authenticate, authorize(["admin"]), validateBody(updateCategorySchema), updateCategory)
router.delete("/:id", authenticate, authorize(["admin"]), deleteCategory)

export default router
