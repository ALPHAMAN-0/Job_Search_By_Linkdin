import { useState } from "react";
import http from "../api/http";

export default function UploadResume({ setJobs }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setStatus("Uploading...");
      const res = await http.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setJobs(res.data.jobs || []);
      setStatus("Upload and match completed");
    } catch (err) {
      setStatus(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload Resume
      </button>
      <p>{status}</p>
    </div>
  );
}