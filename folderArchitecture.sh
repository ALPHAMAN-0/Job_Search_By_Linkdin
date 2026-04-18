#!/usr/bin/env bash
set -e

PROJECT_NAME="resume_job_portal"

mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Root files
touch .gitignore docker-compose.yml .env.example .env

# Frontend
mkdir -p frontend/src/{api,components,pages,hooks,utils,styles}
mkdir -p frontend/public
touch frontend/package.json
touch frontend/src/{main.jsx,App.jsx}
touch frontend/src/api/http.js
touch frontend/src/pages/{UploadResume.jsx,MatchedJobs.jsx}

# Backend API
mkdir -p backend/src/{config,controllers,routes,models,services,middleware,utils}
mkdir -p backend/src/services/{resume,job,matching}
touch backend/package.json
touch backend/src/{app.js,server.js}
touch backend/src/config/{db.js,env.js}
touch backend/src/routes/{resume.routes.js,job.routes.js,match.routes.js}
touch backend/src/controllers/{resume.controller.js,job.controller.js,match.controller.js}
touch backend/src/models/{User.js,Resume.js,Job.js,Match.js}
touch backend/src/services/resume/{parser.service.js,extractor.service.js}
touch backend/src/services/job/{fetcher.service.js,normalizer.service.js}
touch backend/src/services/matching/scoring.service.js

# Worker
mkdir -p worker/src/{jobs,schedulers,services,utils}
touch worker/package.json
touch worker/src/{index.js,queue.js}
touch worker/src/jobs/{fetchJobs.job.js,rematchJobs.job.js}
touch worker/src/schedulers/cron.js

# Shared
mkdir -p shared/{constants,types,utils}
touch shared/constants/index.js
touch shared/utils/helpers.js

# Optional docs
mkdir -p docs
touch docs/{architecture.md,api-contract.md,mvp-roadmap.md}

echo "Folder architecture created in: $PROJECT_NAME"