const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resume.routes");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API running" });
});

app.use("/api/resume", resumeRoutes);

module.exports = app;