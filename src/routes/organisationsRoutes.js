const express = require("express");
const {
  getAllOrganisations,
  getOrganisation,
} = require("../controllers/organisationsController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, getAllOrganisations);
router.get("/:orgId", authenticateToken, getOrganisation);

module.exports = router;
