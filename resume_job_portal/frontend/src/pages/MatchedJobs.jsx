export default function MatchedJobs({ jobs, filters, onFiltersChange, sortBy, onSortChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange((currentFilters) => ({
      ...currentFilters,
      [key]: value
    }));
  };

  if (!jobs.length) {
    return (
      <div>
        <h2>Matched Jobs</h2>
        <p>No matched jobs yet. Upload a resume or ingest jobs to see ranked results.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Matched Jobs</h2>
          <p className="muted">Ranked by score with explainable reasons and apply recommendations.</p>
        </div>
        <div className="sort-row">
          <label>
            Sort
            <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
              <option value="best match">Best match</option>
              <option value="latest">Latest</option>
            </select>
          </label>
        </div>
      </div>

      <div className="filter-grid">
        <label>
          Location
          <input
            value={filters.location}
            onChange={(event) => updateFilter("location", event.target.value)}
            placeholder="Search by city or remote"
          />
        </label>
        <label>
          Salary
          <input
            value={filters.salary}
            onChange={(event) => updateFilter("salary", event.target.value)}
            placeholder="e.g. 120k"
          />
        </label>
        <label>
          Date posted
          <select value={filters.datePosted} onChange={(event) => updateFilter("datePosted", event.target.value)}>
            <option value="">Any time</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>
        </label>
        <label>
          Minimum score
          <input
            type="number"
            min="0"
            max="100"
            value={filters.minimumScore}
            onChange={(event) => updateFilter("minimumScore", event.target.value)}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={filters.remote}
            onChange={(event) => updateFilter("remote", event.target.checked)}
          />
          Remote only
        </label>
      </div>

      {jobs.map((job) => (
        <div key={job.id || job.jobId || `${job.title}-${job.company}`} className="job-card">
          <div className="job-card-top">
            <div>
              <h3>{job.title}</h3>
              <p>{job.company} · {job.location}</p>
            </div>
            <div className="score-pill">{Math.round(job.matchScore || 0)}%</div>
          </div>
          <div className="tag-row">
            <span className="tag">{job.recommendation?.label || "Apply soon"}</span>
            {job.remote ? <span className="tag">Remote</span> : null}
            {job.salary?.text || job.salary ? <span className="tag">{job.salary?.text || job.salary}</span> : null}
          </div>
          <p className="muted">{job.recommendation?.message}</p>
          <div className="skills-line">
            <strong>Matched skills:</strong> {(job.matchedSkills || []).join(", ") || "None"}
          </div>
          <div className="skills-line">
            <strong>Missing skills:</strong> {(job.missingSkills || []).join(", ") || "None"}
          </div>
          <ul className="reason-list">
            {(job.reasons || []).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <a href={job.applyLink} target="_blank" rel="noreferrer" className="apply-link">
            Open apply link
          </a>
        </div>
      ))}
    </div>
  );
}