const express = require("express");
const { listMatches, recomputeMatches } = require("../controllers/match.controller");

const router = express.Router();

router.get("/", listMatches);
router.post("/recompute", recomputeMatches);

module.exports = router;
