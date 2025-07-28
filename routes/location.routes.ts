import express from "express"
import {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
    getNearbyLocations,
} from "../controllers/location.controller"
import { authenticate, authorize } from "../middlewares/auth"
import { validateBody } from "../middlewares/validate"
import { createLocationSchema, updateLocationSchema } from "../validators/location.validator"

const router = express.Router()

// Public routes
router.get("/", getAllLocations)
router.get("/nearby", getNearbyLocations)
router.get("/:id", getLocationById)

// Protected routes (admin only)
router.post("/", authenticate, authorize(["admin"]), validateBody(createLocationSchema), createLocation)
router.put("/:id", authenticate, authorize(["admin"]), validateBody(updateLocationSchema), updateLocation)
router.delete("/:id", authenticate, authorize(["admin"]), deleteLocation)

export default router
