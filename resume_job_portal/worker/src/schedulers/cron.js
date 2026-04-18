const { enqueue } = require("../queue");
const { fetchJobsJob } = require("../jobs/fetchJobs.job");
const { rematchJobsJob } = require("../jobs/rematchJobs.job");

const DEFAULT_INTERVAL_MINUTES = Number(process.env.WORKER_INTERVAL_MINUTES || 45);

async function runPipeline() {
	await enqueue(async () => {
		await fetchJobsJob(process.env.JOB_SOURCE || "sample");
		await rematchJobsJob();
	});
}

function startScheduler() {
	runPipeline().catch((error) => {
		console.error("Initial worker run failed:", error.message);
	});

	setInterval(() => {
		runPipeline().catch((error) => {
			console.error("Scheduled worker run failed:", error.message);
		});
	}, DEFAULT_INTERVAL_MINUTES * 60 * 1000);
}

module.exports = { startScheduler, runPipeline };
