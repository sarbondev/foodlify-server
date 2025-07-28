import express from "express"
import AuthRoutes from "./auth.routes"
import UserRoutes from "./user.routes"
import ProductRoutes from "./product.routes"
import CategoryRoutes from "./category.routes"
import LocationRoutes from "./location.routes"

const router = express.Router()

router.use("/auth", AuthRoutes)
router.use("/user", UserRoutes)
router.use("/products", ProductRoutes)
router.use("/category", CategoryRoutes)
router.use("/location", LocationRoutes)

export default router
