# Job_Search_By_Linkdin
Resume-based job search portal built with MERN that parses PDF/DOCX resumes, matches users with latest relevant jobs, and shows ranked results with direct apply links.

## Architecture / How it Works

```mermaid
flowchart TD
    Frontend -->|HTTP /api/*| Backend
    Backend -->|connectDB| Database
    Worker -->|connectDB via backend/src/config/db| Database
    Worker -.->|requires backend/src/config/db.js| Backend
    Shared
```

