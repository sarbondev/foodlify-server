const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const { UserValidator } = require("../validators/user-validator");

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get("/", authorize(["admin"]), getAllUsers);
router.get("/:id", authorize(["admin"]), getUserById);
router.put(
  "/:id",
  authorize(["admin"]),
  validateBody(UserValidator),
  updateUser
);
router.delete("/:id", authorize(["admin"]), deleteUser);
router.patch("/:id/toggle-status", authorize(["admin"]), toggleUserStatus);

module.exports = router;
