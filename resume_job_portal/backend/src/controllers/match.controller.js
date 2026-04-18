const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Match = require("../models/Match");
const { rankMatchesForResume } = require("../services/matching/engine.service");

function formatMatch(match) {
	return {
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
	};
}

async function listMatches(req, res) {
	try {
		const query = {};

		if (req.query.resumeId) {
			query.resumeId = req.query.resumeId;
		}

		const matches = await Match.find(query)
			.populate("jobId")
			.sort({ matchScore: -1, rankedAt: -1 });

		return res.json({ matches: matches.map(formatMatch) });
	} catch (error) {
		return res.status(500).json({ message: "Failed to load matches", error: error.message });
	}
}

async function recomputeMatches(req, res) {
	try {
		const resumeId = req.body.resumeId || req.query.resumeId;
		const resume = resumeId
			? await Resume.findById(resumeId)
			: await Resume.findOne().sort({ uploadedAt: -1 });

		if (!resume) {
			return res.status(404).json({ message: "Resume not found" });
		}

		const jobs = await Job.find().sort({ fetchedAt: -1, postedAt: -1 });
		const rankedMatches = rankMatchesForResume({ resume, jobs });

		await Match.deleteMany({ resumeId: resume._id });

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

		const refreshedMatches = await Match.find({ resumeId: resume._id })
			.populate("jobId")
			.sort({ matchScore: -1, rankedAt: -1 });

		return res.json({
			message: "Matches recomputed successfully",
			resumeId: resume._id,
			matches: refreshedMatches.map(formatMatch)
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to recompute matches", error: error.message });
	}
}

module.exports = { listMatches, recomputeMatches };
