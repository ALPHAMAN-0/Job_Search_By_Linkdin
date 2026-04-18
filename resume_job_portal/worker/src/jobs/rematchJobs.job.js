const Resume = require("../../../backend/src/models/Resume");
const Job = require("../../../backend/src/models/Job");
const Match = require("../../../backend/src/models/Match");
const { rankMatchesForResume } = require("../../../backend/src/services/matching/engine.service");

async function rematchJobsJob() {
	const latestResume = await Resume.findOne().sort({ uploadedAt: -1 });

	if (!latestResume) {
		return [];
	}

	const jobs = await Job.find().sort({ fetchedAt: -1, postedAt: -1 });
	const rankedMatches = rankMatchesForResume({ resume: latestResume, jobs });

	await Match.deleteMany({ resumeId: latestResume._id });

	if (rankedMatches.length) {
		await Match.insertMany(
			rankedMatches.map((match) => ({
				resumeId: latestResume._id,
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

	return rankedMatches;
}

module.exports = { rematchJobsJob };
