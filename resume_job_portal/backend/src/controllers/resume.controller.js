const Resume = require("../models/Resume");
const Match = require("../models/Match");
const Job = require("../models/Job");
const { extractTextFromDocument } = require("../services/resume/extractor.service");
const { buildProfile } = require("../services/resume/parser.service");
const { rankMatchesForResume } = require("../services/matching/engine.service");

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const extractedText = await extractTextFromDocument(req.file.path, req.file.mimetype);
    const profile = buildProfile({ text: extractedText, fileName: req.file.originalname });

    const resume = await Resume.create({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extractedText,
      profile,
      parsedAt: new Date()
    });

    const jobs = await Job.find().sort({ fetchedAt: -1, postedAt: -1 });
    const rankedMatches = rankMatchesForResume({ resume, jobs });

    if (rankedMatches.length) {
      await Match.insertMany(
        rankedMatches.map((match) => ({
          resumeId: resume._id,
          jobId: match.jobId,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          reasons: match.reasons,
          freshnessScore: match.freshnessScore,
          skillScore: match.skillScore,
          titleScore: match.titleScore,
          requirementScore: match.requirementScore,
          recommendation: match.recommendation,
          rankedAt: new Date()
        }))
      );
    }

    const matches = await Match.find({ resumeId: resume._id })
      .populate("jobId")
      .sort({ matchScore: -1, rankedAt: -1 });

    const responseMatches = matches.map((match) => ({
      id: match._id,
      jobId: match.jobId?._id,
      title: match.jobId?.title,
      company: match.jobId?.company,
      location: match.jobId?.location,
      salary: match.jobId?.salary,
      applyLink: match.jobId?.applyLink,
      remote: match.jobId?.remote,
      postedAt: match.jobId?.postedAt,
      matchScore: match.matchScore,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      reasons: match.reasons,
      recommendation: match.recommendation,
      freshnessScore: match.freshnessScore,
      skillScore: match.skillScore,
      titleScore: match.titleScore,
      requirementScore: match.requirementScore
    }));

    return res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
      profile,
      matches: responseMatches
    });
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed",
      error: error.message
    });
  }
}

module.exports = { uploadResume };