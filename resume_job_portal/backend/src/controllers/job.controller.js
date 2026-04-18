const Job = require("../models/Job");
const { fetchJobsFromCompliantSources } = require("../services/job/fetcher.service");
const { normalizeJob } = require("../services/job/normalizer.service");

async function listJobs(req, res) {
	try {
		const jobs = await Job.find().sort({ fetchedAt: -1, postedAt: -1, createdAt: -1 });
		return res.json({ jobs });
	} catch (error) {
		return res.status(500).json({ message: "Failed to load jobs", error: error.message });
	}
}

async function ingestJobs(req, res) {
	try {
		const source = req.body.source || req.query.source || "sample";
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

		return res.status(201).json({
			message: "Jobs ingested successfully",
			count: savedJobs.length,
			jobs: savedJobs
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to ingest jobs", error: error.message });
	}
}

module.exports = { ingestJobs, listJobs };
