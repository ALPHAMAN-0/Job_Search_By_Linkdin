const express = require("express");
const { ingestJobs, listJobs } = require("../controllers/job.controller");

const router = express.Router();

router.get("/", listJobs);
router.post("/ingest", ingestJobs);

module.exports = router;
