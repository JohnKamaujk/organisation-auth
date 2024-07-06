const express = require("express");
const {
  getAllOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
} = require("../controllers/organisationsController");
const { authenticateToken } = require("../middleware/auth");
const { validateOrganisation } = require("../middleware/validation");

const router = express.Router();

router.get("/", authenticateToken, getAllOrganisations);
router.get("/:orgId", authenticateToken, getOrganisation);
router.post("/", authenticateToken, validateOrganisation, createOrganisation);
router.post("/:orgId/users", authenticateToken, addUserToOrganisation);

module.exports = router;
