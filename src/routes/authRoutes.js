const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { validateRegistration } = require("../middleware/validation");

const router = express.Router();

router.post("/register", validateRegistration, registerUser);
router.post("/login", loginUser)

module.exports = router;
