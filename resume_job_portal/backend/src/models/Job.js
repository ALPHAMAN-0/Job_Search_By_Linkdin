const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
	{
		dedupeKey: { type: String, required: true, unique: true, index: true },
		source: { type: String, required: true },
		sourceUrl: { type: String, default: "" },
		externalId: { type: String, default: "" },
		title: { type: String, required: true },
		company: { type: String, required: true },
		location: { type: String, required: true },
		remote: { type: Boolean, default: false },
		postedAt: { type: Date, default: Date.now },
		salary: {
			text: { type: String, default: "" },
			min: { type: Number, default: null },
			max: { type: Number, default: null },
			currency: { type: String, default: "" }
		},
		applyLink: { type: String, required: true },
		requirements: { type: [String], default: [] },
		description: { type: String, default: "" },
		keywords: { type: [String], default: [] },
		fetchedAt: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
