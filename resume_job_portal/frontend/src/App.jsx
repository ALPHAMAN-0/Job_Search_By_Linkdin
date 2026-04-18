import { useState } from "react";
import UploadResume from "./pages/UploadResume";
import MatchedJobs from "./pages/MatchedJobs";

export default function App() {
  const [jobs, setJobs] = useState([]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Resume Job Portal</h1>
      <UploadResume setJobs={setJobs} />
      <MatchedJobs jobs={jobs} />
    </div>
  );
}