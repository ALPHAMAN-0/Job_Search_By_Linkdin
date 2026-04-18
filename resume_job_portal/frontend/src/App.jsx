import { useEffect, useMemo, useState } from "react";
import UploadResume from "./pages/UploadResume";
import MatchedJobs from "./pages/MatchedJobs";
import http from "./api/http";
import "./styles/app.css";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    salary: "",
    datePosted: "",
    remote: false,
    minimumScore: 0
  });
  const [sortBy, setSortBy] = useState("best match");
  const [status, setStatus] = useState("Ready to upload a resume");

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        const response = await http.get("/jobs");
        if (isMounted) {
          setJobs(response.data.jobs || []);
        }
      } catch (error) {
        if (isMounted) {
          setStatus(error?.response?.data?.message || "Failed to load jobs");
        }
      }
    }

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleJobs = useMemo(() => {
    const list = matches.length ? matches : jobs;

    const filtered = list.filter((job) => {
      const locationValue = String(job.location || "").toLowerCase();
      const salaryValue = String(job.salary?.text || job.salary || "").toLowerCase();
      const postedAt = job.postedAt ? new Date(job.postedAt) : null;
      const postedDays = postedAt ? (Date.now() - postedAt.getTime()) / 86400000 : Infinity;

      if (filters.location && !locationValue.includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.salary && !salaryValue.includes(filters.salary.toLowerCase())) {
        return false;
      }

      if (filters.remote && !job.remote) {
        return false;
      }

      if (filters.datePosted === "24h" && postedDays > 1) {
        return false;
      }

      if (filters.datePosted === "7d" && postedDays > 7) {
        return false;
      }

      if (Number(job.matchScore || 0) < Number(filters.minimumScore || 0)) {
        return false;
      }

      return true;
    });

    return [...filtered].sort((leftJob, rightJob) => {
      if (sortBy === "latest") {
        return new Date(rightJob.postedAt || 0) - new Date(leftJob.postedAt || 0);
      }

      return Number(rightJob.matchScore || 0) - Number(leftJob.matchScore || 0);
    });
  }, [filters, jobs, matches, sortBy]);

  const handleUploadComplete = (payload) => {
    setResume(payload.resume || null);
    setMatches(payload.matches || []);
    setJobs(payload.matches || []);
    setStatus(payload.message || "Resume processed successfully");
  };

  return (
    <div className="app-shell">
      <div className="hero">
        <p className="eyebrow">Resume matching portal</p>
        <h1>Upload a resume and get ranked jobs with explainable matches.</h1>
        <p className="hero-copy">Backend parsing, ingestion, matching, and ranking are connected end to end for the MVP flow.</p>
        <div className="status-pill">{status}</div>
      </div>

      <div className="content-grid">
        <section className="panel">
          <UploadResume onUploadComplete={handleUploadComplete} setStatus={setStatus} />
          {resume ? (
            <div className="resume-card">
              <h3>Parsed profile</h3>
              <p><strong>Target title:</strong> {resume.profile?.targetTitle || "Unknown"}</p>
              <p><strong>Skills:</strong> {(resume.profile?.skills || []).join(", ") || "None detected"}</p>
              <p><strong>Keywords:</strong> {(resume.profile?.keywords || []).join(", ") || "None detected"}</p>
            </div>
          ) : null}
        </section>

        <section className="panel">
          <MatchedJobs
            jobs={visibleJobs}
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </section>
      </div>
    </div>
  );
}