const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
	{
		resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true, index: true },
		jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
		matchScore: { type: Number, required: true },
		matchedSkills: { type: [String], default: [] },
		missingSkills: { type: [String], default: [] },
		reasons: { type: [String], default: [] },
		freshnessScore: { type: Number, default: 0 },
		skillScore: { type: Number, default: 0 },
		titleScore: { type: Number, default: 0 },
		requirementScore: { type: Number, default: 0 },
		recommendation: {
			label: { type: String, default: "Apply soon" },
			message: { type: String, default: "" },
			suggestedApplyTime: { type: String, default: "" },
			timezone: { type: String, default: "UTC" }
		},
		rankedAt: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

matchSchema.index({ resumeId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);
