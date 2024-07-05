const express = require("express");
const { registerUser } = require("../controllers/authController");
const { validateRegistration } = require("../middleware/validation");

const router = express.Router();

router.post("/register", validateRegistration, registerUser);

module.exports = router;
