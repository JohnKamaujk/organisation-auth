const express = require("express");
const { getUserRecord } = require("../controllers/usersController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/:id", authenticateToken, getUserRecord);

module.exports = router;
