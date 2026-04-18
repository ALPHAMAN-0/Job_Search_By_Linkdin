const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  mimetype: String,
  size: Number,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resume", resumeSchema);