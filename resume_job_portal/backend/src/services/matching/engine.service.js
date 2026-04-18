const { scoreJobMatch } = require("./scoring.service");

function rankMatchesForResume({ resume, jobs, timezone = "UTC" }) {
  return jobs
    .map((job) => scoreJobMatch(resume.profile || {}, job, { timezone }))
    .filter(Boolean)
    .sort((leftMatch, rightMatch) => rightMatch.matchScore - leftMatch.matchScore);
}

module.exports = { rankMatchesForResume };