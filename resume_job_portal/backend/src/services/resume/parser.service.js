const COMMON_SKILLS = [
	"javascript",
	"typescript",
	"react",
	"node",
	"node.js",
	"express",
	"mongodb",
	"mongoose",
	"python",
	"java",
	"sql",
	"postgresql",
	"aws",
	"docker",
	"kubernetes",
	"html",
	"css",
	"redux",
	"graphql",
	"rest",
	"api",
	"microservices",
	"testing",
	"jest",
	"cypress",
	"tailwind",
	"figma",
	"git"
];

const TITLE_HINTS = [
	"software engineer",
	"frontend engineer",
	"frontend developer",
	"backend engineer",
	"backend developer",
	"full stack engineer",
	"full stack developer",
	"data analyst",
	"data engineer",
	"product manager",
	"project manager",
	"devops engineer",
	"qa engineer",
	"mobile developer"
];

const STOP_WORDS = new Set([
	"and",
	"the",
	"with",
	"for",
	"that",
	"from",
	"have",
	"this",
	"your",
	"you",
	"are",
	"was",
	"were",
	"will",
	"they",
	"their",
	"our",
	"about",
	"into",
	"also",
	"using",
	"used",
	"role",
	"work",
	"team",
	"years",
	"experience",
	"resume",
	"profile"
]);

function normalizeText(text) {
	return text.replace(/\s+/g, " ").trim();
}

function extractSkills(text) {
	const lowerText = text.toLowerCase();
	return [...new Set(COMMON_SKILLS.filter((skill) => lowerText.includes(skill)))];
}

function inferTargetTitle(lines, text, fileName) {
	const lowerText = text.toLowerCase();

	for (const hint of TITLE_HINTS) {
		if (lowerText.includes(hint)) {
			return hint
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		}
	}

	const fileTitle = fileName
		.replace(/\.[^.]+$/, "")
		.replace(/[-_]+/g, " ")
		.replace(/\b(cv|resume)\b/gi, "")
		.trim();

	if (fileTitle) {
		return fileTitle
			.split(/\s+/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	return lines[0] || "Target Role Unknown";
}

function extractExperience(lines, text) {
	const experienceLines = lines.filter((line) => {
		const lowerLine = line.toLowerCase();
		return lowerLine.includes("experience") || /\b\d+\s*\+?\s*years?\b/.test(lowerLine);
	});

	if (experienceLines.length) {
		return experienceLines.slice(0, 6);
	}

	const matchedYears = text.match(/\b\d+\s*\+?\s*years?\b/gi) || [];
	return [...new Set(matchedYears)].slice(0, 6);
}

function extractKeywords(text, skills, targetTitle) {
	const tokens = text
		.toLowerCase()
		.replace(/[^a-z0-9+.#\s-]/g, " ")
		.split(/\s+/)
		.filter((token) => token.length > 2 && !STOP_WORDS.has(token));

	const candidateKeywords = [...skills, ...targetTitle.toLowerCase().split(/\s+/), ...tokens];

	return [...new Set(candidateKeywords)].slice(0, 20);
}

function buildProfile({ text, fileName = "" }) {
	const normalizedText = normalizeText(text);
	const lines = text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.slice(0, 30);

	const skills = extractSkills(normalizedText);
	const targetTitle = inferTargetTitle(lines, normalizedText, fileName);
	const experience = extractExperience(lines, normalizedText);
	const keywords = extractKeywords(normalizedText, skills, targetTitle);

	return {
		targetTitle,
		skills,
		experience,
		keywords
	};
}

module.exports = { buildProfile };
