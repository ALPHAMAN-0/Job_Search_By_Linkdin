function uniqueList(values) {
	return [...new Set(values.filter(Boolean))];
}

function tokenize(value) {
	return String(value || "")
		.toLowerCase()
		.replace(/[^a-z0-9+.#\s-]/g, " ")
		.split(/\s+/)
		.filter(Boolean);
}

function hasOverlap(text, tokens) {
	const lowerText = String(text || "").toLowerCase();
	return tokens.some((token) => lowerText.includes(token));
}

function getFreshnessScore(postedAt) {
	const ageHours = Math.max(0, (Date.now() - new Date(postedAt).getTime()) / 36e5);

	if (ageHours <= 12) return 20;
	if (ageHours <= 48) return 16;
	if (ageHours <= 96) return 10;
	if (ageHours <= 168) return 6;
	return 3;
}

function buildRecommendation(postedAt, timezone = "UTC") {
	const postedDate = new Date(postedAt);
	const ageHours = Math.max(0, (Date.now() - postedDate.getTime()) / 36e5);
	const bestApplyTime = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		dateStyle: "medium",
		timeStyle: "short"
	}).format(new Date(Date.now() + 2 * 60 * 60 * 1000));

	if (ageHours <= 12) {
		return {
			label: "Apply now",
			message: "Fresh posting. Submit while visibility is highest.",
			suggestedApplyTime: bestApplyTime,
			timezone
		};
	}

	if (ageHours <= 72) {
		return {
			label: "Apply today at best time",
			message: "This posting is still recent. Apply during the next business window.",
			suggestedApplyTime: bestApplyTime,
			timezone
		};
	}

	return {
		label: "Apply soon",
		message: "The role is older, but a strong match can still stand out.",
		suggestedApplyTime: bestApplyTime,
		timezone
	};
}

function scoreJobMatch(resumeProfile, job, options = {}) {
	if (!resumeProfile || !job) {
		return null;
	}

	const resumeSkills = uniqueList((resumeProfile.skills || []).map((skill) => skill.toLowerCase()));
	const resumeKeywords = uniqueList((resumeProfile.keywords || []).map((keyword) => keyword.toLowerCase()));
	const jobRequirements = uniqueList((job.requirements || []).map((requirement) => requirement.toLowerCase()));
	const jobKeywords = uniqueList((job.keywords || []).map((keyword) => keyword.toLowerCase()));
	const jobTitleTokens = tokenize(job.title);
	const targetTitleTokens = tokenize(resumeProfile.targetTitle);

	const matchedSkills = resumeSkills.filter((skill) =>
		jobRequirements.some((requirement) => requirement.includes(skill) || skill.includes(requirement)) ||
		jobKeywords.some((keyword) => keyword.includes(skill) || skill.includes(keyword)) ||
		hasOverlap(skill, jobTitleTokens)
	);

	const missingSkills = jobRequirements.filter(
		(requirement) => !matchedSkills.some((skill) => requirement.includes(skill) || skill.includes(requirement))
	);

	const skillScore = Math.min(45, matchedSkills.length * 9);
	const titleScore = hasOverlap(resumeProfile.targetTitle, jobTitleTokens)
		? 25
		: targetTitleTokens.some((token) => jobTitleTokens.includes(token))
			? 18
			: 6;
	const requirementOverlap = jobRequirements.filter((requirement) =>
		resumeSkills.some((skill) => requirement.includes(skill) || skill.includes(requirement)) ||
		resumeKeywords.some((keyword) => requirement.includes(keyword) || keyword.includes(requirement))
	);
	const requirementScore = Math.min(20, requirementOverlap.length * 5);
	const freshnessScore = getFreshnessScore(job.postedAt);

	const matchScore = Math.min(100, skillScore + titleScore + requirementScore + freshnessScore);

	const reasons = uniqueList([
		matchedSkills.length ? `Matches ${matchedSkills.length} skill${matchedSkills.length === 1 ? "" : "s"}` : "No direct skill overlap",
		titleScore >= 18 ? "Target title aligns with the role" : "Role is adjacent to the target title",
		requirementOverlap.length ? `Covers ${requirementOverlap.length} requirement${requirementOverlap.length === 1 ? "" : "s"}` : "Missing several listed requirements",
		freshnessScore >= 16 ? "Recently posted" : "Older posting, lower freshness weight"
	]);

	return {
		jobId: job._id,
		matchScore,
		matchedSkills: uniqueList(matchedSkills),
		missingSkills: uniqueList(missingSkills),
		reasons,
		freshnessScore,
		skillScore,
		titleScore,
		requirementScore,
		recommendation: buildRecommendation(job.postedAt, options.timezone || "UTC")
	};
}

module.exports = { scoreJobMatch, buildRecommendation };
