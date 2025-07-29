const express = require("express");
const AuthRoutes = require("./auth.routes");
const UserRoutes = require("./user.routes");
const ProductRoutes = require("./product.routes");
const CategoryRoutes = require("./category.routes");
const LocationRoutes = require("./location.routes");

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/products", ProductRoutes);
router.use("/category", CategoryRoutes);
router.use("/location", LocationRoutes);

module.exports = router;
