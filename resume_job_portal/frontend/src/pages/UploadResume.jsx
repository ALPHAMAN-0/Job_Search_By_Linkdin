import { useState } from "react";
import http from "../api/http";

export default function UploadResume({ onUploadComplete, setStatus }) {
  const [file, setFile] = useState(null);
  const [localStatus, setLocalStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLocalStatus("Uploading and parsing resume...");
      setStatus?.("Uploading and parsing resume...");
      const res = await http.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onUploadComplete?.(res.data);
      setLocalStatus("Upload complete. Matches refreshed.");
      setStatus?.("Upload complete. Matches refreshed.");
    } catch (err) {
      const message = err?.response?.data?.message || "Upload failed";
      setLocalStatus(message);
      setStatus?.(message);
    }
  };

  return (
    <div className="upload-card">
      <h2>Upload Resume</h2>
      <p className="muted">Accepts PDF and DOCX files up to 5 MB.</p>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} className="primary-button">
        Upload Resume
      </button>
      <p className="status-text">{localStatus}</p>
    </div>
  );
}