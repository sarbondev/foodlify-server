import { Router } from "express"
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    updateProductStock,
} from "../controllers/product.controller"
import { authenticate, authorize } from "../middlewares/auth"
import { validateBody } from "../middlewares/validate"
import { createProductSchema, updateProductSchema } from "../validators/product.validator"

const router = Router()

// Public routes
router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.get("/category/:categoryId", getProductsByCategory)

// Protected routes (admin and staff)
// router.post("/", authenticate, authorize(["admin", "staff"]), validateBody(createProductSchema), createProduct)
router.post("/", validateBody(createProductSchema), createProduct)
router.put("/:id", authenticate, authorize(["admin", "staff"]), validateBody(updateProductSchema), updateProduct)
router.patch("/:id/stock", authenticate, authorize(["admin", "staff"]), updateProductStock)
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct)

export default router
