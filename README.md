# Job_Search_By_Linkdin
Resume-based job search portal built with MERN that parses PDF/DOCX resumes, matches users with latest relevant jobs, and shows ranked results with direct apply links.

## Architecture / How it Works

```mermaid
flowchart LR
    A[User] --> B[Job Search By Linkdin]
    B --> C{Logic}
    C --> D[(Data)]
    C --> E[Output]
    D --> C
```

