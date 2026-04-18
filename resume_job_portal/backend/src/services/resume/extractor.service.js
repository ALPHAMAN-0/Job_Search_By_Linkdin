const fs = require("fs/promises");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractTextFromDocument(filePath, mimeType) {
	if (mimeType === "application/pdf") {
		const buffer = await fs.readFile(filePath);
		const parsed = await pdfParse(buffer);
		return parsed.text || "";
	}

	if (
		mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
		mimeType === "application/msword"
	) {
		const extracted = await mammoth.extractRawText({ path: filePath });
		return extracted.value || "";
	}

	throw new Error("Only PDF and DOCX resumes are supported");
}

module.exports = { extractTextFromDocument };
