# CLAUDE.md — Job_Search_By_Linkdin

## Commands
- `npm run backend` (from `resume_job_portal/`) — runs `npm run dev --prefix backend`
- `npm run frontend` (from `resume_job_portal/`) — runs `npm run dev --prefix frontend`
- `npm run worker` (from `resume_job_portal/`) — runs `npm run dev --prefix worker`
- No build/test/lint scripts found in `resume_job_portal/package.json` — TODO: verify inside `backend/package.json`, `frontend/package.json`, `worker/package.json` if needed.

## Rules
- No stated rules found with direct evidence (no CONTRIBUTING, no lint/format config read).

## Read first
- `resume_job_portal/backend/src/app.js` — Express app, route mounting
- `resume_job_portal/backend/src/server.js` — DB connect + listen, env loading
- `resume_job_portal/frontend/src/App.jsx` — top-level frontend state/data flow

Architecture: see ARCHITECTURE.md — read before structural changes
