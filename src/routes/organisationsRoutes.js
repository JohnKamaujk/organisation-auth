const express = require("express");
const { getAllOrganisations } = require("../controllers/organisationsController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/organisations", authenticateToken, getAllOrganisations);

module.exports = router;
