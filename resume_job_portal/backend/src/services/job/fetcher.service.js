const SAMPLE_JOBS = [
	{
		externalId: "sample-frontend-1",
		title: "Frontend Engineer",
		company: "Northstar Labs",
		location: "Remote",
		remote: true,
		postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
		salary: "$95k - $130k",
		applyLink: "https://example.com/jobs/frontend-engineer",
		requirements: ["React", "TypeScript", "API integration", "Testing"],
		description: "Build product surfaces for a fast-moving SaaS team.",
		sourceUrl: "https://example.com/jobs/frontend-engineer"
	},
	{
		externalId: "sample-backend-1",
		title: "Backend Engineer",
		company: "Harbor Systems",
		location: "New York, NY",
		remote: false,
		postedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
		salary: "$120k - $155k",
		applyLink: "https://example.com/jobs/backend-engineer",
		requirements: ["Node.js", "Express", "MongoDB", "APIs", "Docker"],
		description: "Own API services and data pipelines.",
		sourceUrl: "https://example.com/jobs/backend-engineer"
	},
	{
		externalId: "sample-fullstack-1",
		title: "Full Stack Developer",
		company: "Orbit Commerce",
		location: "Austin, TX",
		remote: true,
		postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
		salary: "$110k - $145k",
		applyLink: "https://example.com/jobs/fullstack-developer",
		requirements: ["JavaScript", "React", "Node.js", "SQL", "Git"],
		description: "Ship customer-facing features end to end.",
		sourceUrl: "https://example.com/jobs/fullstack-developer"
	},
	{
		externalId: "sample-data-1",
		title: "Data Analyst",
		company: "Summit Metrics",
		location: "Chicago, IL",
		remote: true,
		postedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
		salary: "$80k - $105k",
		applyLink: "https://example.com/jobs/data-analyst",
		requirements: ["SQL", "Python", "Analytics", "Dashboards"],
		description: "Analyze trends and support decision-making.",
		sourceUrl: "https://example.com/jobs/data-analyst"
	}
];

async function fetchJobsFromCompliantSources(source = "sample") {
	if (source !== "sample") {
		return SAMPLE_JOBS;
	}

	return SAMPLE_JOBS;
}

module.exports = { fetchJobsFromCompliantSources };
