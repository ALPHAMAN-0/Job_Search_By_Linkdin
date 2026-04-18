const Resume = require("../models/Resume");

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resume = await Resume.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    return res.status(201).json({
      message: "Resume uploaded successfully",
      resume
    });
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed",
      error: error.message
    });
  }
}

module.exports = { uploadResume };