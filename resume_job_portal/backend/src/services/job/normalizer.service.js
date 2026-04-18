const crypto = require("crypto");

function normalizeRequirements(requirements) {
	if (!requirements) {
		return [];
	}

	if (Array.isArray(requirements)) {
		return requirements.map((requirement) => String(requirement).trim()).filter(Boolean);
	}

	return String(requirements)
		.split(/,|\n|;|•/)
		.map((requirement) => requirement.trim())
		.filter(Boolean);
}

function normalizeJob(rawJob, source = "sample") {
	const requirements = normalizeRequirements(rawJob.requirements);
	const title = String(rawJob.title || "Unknown role").trim();
	const company = String(rawJob.company || "Unknown company").trim();
	const location = String(rawJob.location || "Remote").trim();
	const applyLink = String(rawJob.applyLink || rawJob.url || rawJob.sourceUrl || "").trim();
	const dedupeSource = [source, title, company, location, applyLink].join("|").toLowerCase();

	return {
		dedupeKey: crypto.createHash("sha1").update(dedupeSource).digest("hex"),
		source,
		sourceUrl: String(rawJob.sourceUrl || rawJob.applyLink || "").trim(),
		externalId: String(rawJob.externalId || "").trim(),
		title,
		company,
		location,
		remote: Boolean(rawJob.remote),
		postedAt: rawJob.postedAt ? new Date(rawJob.postedAt) : new Date(),
		salary:
			typeof rawJob.salary === "string"
				? { text: rawJob.salary }
				: {
						text: rawJob.salary?.text || "",
						min: rawJob.salary?.min ?? null,
						max: rawJob.salary?.max ?? null,
						currency: rawJob.salary?.currency || ""
					},
		applyLink,
		requirements,
		description: String(rawJob.description || "").trim(),
		keywords: normalizeRequirements(rawJob.keywords || requirements),
		fetchedAt: new Date()
	};
}

module.exports = { normalizeJob };
