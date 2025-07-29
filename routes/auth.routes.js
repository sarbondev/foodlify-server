const express = require("express");
const {
  signUp,
  signIn,
  getProfile,
} = require("../controllers/auth.controller");
const { validateBody } = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");
const { signUpSchema, signInSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/signup", validateBody(signUpSchema), signUp);
router.post("/signin", validateBody(signInSchema), signIn);
router.get("/profile", authenticate, getProfile);

module.exports = router;
