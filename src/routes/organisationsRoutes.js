const express = require("express");
const {
  getAllOrganisations,
  getOrganisation,
  createOrganisation,
} = require("../controllers/organisationsController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, getAllOrganisations);
router.get("/:orgId", authenticateToken, getOrganisation);
router.post("/", authenticateToken, createOrganisation);

module.exports = router;
