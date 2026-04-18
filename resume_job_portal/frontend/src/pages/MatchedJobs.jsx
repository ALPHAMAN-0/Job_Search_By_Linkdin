export default function MatchedJobs({ jobs }) {
  if (!jobs.length) return <p>No matched jobs yet.</p>;

  return (
    <div>
      <h2>Matched Jobs</h2>
      {jobs.map((job, i) => (
        <div key={i} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <h3>{job.jobTitle}</h3>
          <p>{job.company} - {job.location}</p>
          <p>Match Score: {job.matchScore}</p>
          <a href={job.applyLink} target="_blank" rel="noreferrer">Apply Link</a>
        </div>
      ))}
    </div>
  );
}