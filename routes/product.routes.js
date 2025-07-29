const { Router } = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  updateProductStock,
} = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:categoryId", getProductsByCategory);

// Protected routes (admin and staff)
// router.post("/", authenticate, authorize(["admin", "staff"]), validateBody(createProductSchema), createProduct);
router.post("/", validateBody(createProductSchema), createProduct);
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "staff"]),
  validateBody(updateProductSchema),
  updateProduct
);
router.patch(
  "/:id/stock",
  authenticate,
  authorize(["admin", "staff"]),
  updateProductStock
);
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct);

module.exports = router;
