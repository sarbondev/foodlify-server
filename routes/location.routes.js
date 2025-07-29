const express = require("express");
const {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  getNearbyLocations,
} = require("../controllers/location.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const {
  createLocationSchema,
  updateLocationSchema,
} = require("../validators/location.validator");

const router = express.Router();

// Public routes
router.get("/", getAllLocations);
router.get("/nearby", getNearbyLocations);
router.get("/:id", getLocationById);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validateBody(createLocationSchema),
  createLocation
);
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateBody(updateLocationSchema),
  updateLocation
);
router.delete("/:id", authenticate, authorize(["admin"]), deleteLocation);

module.exports = router;
