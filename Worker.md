---
tags: [component, Job_Search_By_Linkdin]
---
- Path: `resume_job_portal/worker/` (`src/index.js`, `src/queue.js`, `src/jobs`, `src/schedulers`)
- Role: Background job runner; connects DB then `startScheduler()` (`worker/src/index.js`)
- Talks to: [[Database]], [[Backend]]
- Back: [[ARCHITECTURE]]
