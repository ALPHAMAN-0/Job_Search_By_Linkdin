const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  filePath: { type: String, required: true },
  extractedText: { type: String, default: "" },
  profile: {
    targetTitle: { type: String, default: "" },
    skills: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    keywords: { type: [String], default: [] }
  },
  parsedAt: { type: Date },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resume", resumeSchema);