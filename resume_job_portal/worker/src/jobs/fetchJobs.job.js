const Job = require("../../../backend/src/models/Job");
const { fetchJobsFromCompliantSources } = require("../../../backend/src/services/job/fetcher.service");
const { normalizeJob } = require("../../../backend/src/services/job/normalizer.service");

async function fetchJobsJob(source = "sample") {
	const rawJobs = await fetchJobsFromCompliantSources(source);
	const normalizedJobs = rawJobs.map((rawJob) => normalizeJob(rawJob, source));
	const savedJobs = [];

	for (const job of normalizedJobs) {
		const savedJob = await Job.findOneAndUpdate(
			{ dedupeKey: job.dedupeKey },
			{ $set: job },
			{ upsert: true, setDefaultsOnInsert: true, returnDocument: "after" }
		);
		savedJobs.push(savedJob);
	}

	return savedJobs;
}

module.exports = { fetchJobsJob };
