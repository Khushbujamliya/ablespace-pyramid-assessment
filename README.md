# Pyramid — AbleSpace Full Stack Developer Assessment

Pyramid is a task and project management app built for the AbleSpace Full Stack Developer assessment. It supports guest login, Google OAuth, project and task management (board/list views, subtasks, comments, activity log), theme customization, and a responsive layout.

## Live Demo

- **Frontend (live app):** https://ablespace-pyramid-assessment.vercel.app
- **Backend API:** https://ablespace-pyramid-backend.onrender.com

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30–60 seconds to respond while the server wakes up.

## Repository Structure

```
/frontend   → Next.js app (UI, pages, components)
/backend    → NestJS API (auth, projects, tasks, comments, activity)
```

See `/frontend/README.md` and `/backend/README.md` for setup instructions specific to each.

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** NestJS, MongoDB with Mongoose
- **Auth:** JWT (guest login) + Google OAuth 2.0
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Core Features

- Guest login (no signup required) and Google OAuth login
- Project management: create, edit, delete, assign a lead, set due dates
- Task management: board view (drag-and-drop-style columns) and table/list view
- Task details: description, status, priority, due date, subtasks, and threaded comments
- Activity feed auto-logged on task status/priority changes
- Search and filter tasks by priority, status, and title
- Light/dark theme plus 6 accent color options, both persisted across sessions
- Fully responsive layout (desktop, tablet, mobile)

## Deviations from the Figma Design

The assignment PDF only explicitly requires **Guest Login**. The following are documented, intentional deviations from what's shown in the Figma file or from a strict 1:1 visual match:

1. **Google OAuth was implemented in addition to Guest Login.** The Figma design shows a "Login with Google" button, but the written requirements only call for Guest Login. Both are fully functional in this build.
2. **No "no-project" task support.** The current schema requires every task to belong to a project. On the global `/tasks` board (which shows tasks across all projects), creating a new task defaults it to the user's first project, since there's no unassigned/no-project state in the data model yet.
3. **Minor visual differences remain** in spacing and shadow depth in a few places compared to the Figma file. The overall structure, layout, and interaction patterns were matched closely, but pixel-perfect matching was not pursued for every minor spacing detail in the interest of time.

## Part 2 Submission

The UX/functionality review of AbleSpace's Take Data/Caseload screen is included separately (see submission notes / linked document), covering suggested improvements to that flow.

## Author

Khushbu Jamliya
