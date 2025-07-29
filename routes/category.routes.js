const express = require("express");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const { createCategorySchema, updateCategorySchema } = require("../validators/category.validator");

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);

// Protected routes (admin only)
router.post("/", authenticate, authorize(["admin"]), validateBody(createCategorySchema), createCategory);
router.put("/:id", authenticate, authorize(["admin"]), validateBody(updateCategorySchema), updateCategory);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCategory);

module.exports = router;
