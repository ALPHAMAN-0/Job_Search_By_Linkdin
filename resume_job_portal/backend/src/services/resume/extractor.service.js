const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

async function extractTextFromDocument(filePath, mimeType) {
	if (mimeType === "application/pdf") {
		const buffer = await fs.readFile(filePath);
		const parser = new PDFParse({ data: buffer });
		const parsed = await parser.getText();
		await parser.destroy();
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
