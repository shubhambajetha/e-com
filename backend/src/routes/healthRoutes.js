const express = require("express");
const { getHealth } = require("../controllers/healthController");
const { getDatabaseHealth } = require("../controllers/dbController");

const router = express.Router();

router.get("/", getHealth);
router.get("/db", getDatabaseHealth);

module.exports = router;
