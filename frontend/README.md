# Pyramid — Frontend

Next.js frontend for the Pyramid task management app.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the `frontend` folder with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   (Point this at your local backend's URL. For production, this is set to the deployed backend URL in Vercel's project environment variables instead.)

3. Run the dev server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3001` (or whichever port your dev server starts on).

## Build

To confirm the app builds cleanly for production before deploying:

```bash
npm run build
```

## Deployment

This app is deployed on Vercel. The production environment variable `NEXT_PUBLIC_API_URL` is set in the Vercel project settings to point to the live backend on Render.

## Key Structure

- `app/(auth)/` — login and OAuth callback pages
- `app/(app)/` — authenticated app shell: dashboard, tasks, projects, task detail, profile
- `lib/` — API client functions (tasks, projects, users, activity, theme)
- `components/` — shared UI: `Sidebar`, `Topbar`, `TaskCard`, `TaskModal`, `ListView`/`BoardView`, and a shared design-system layer (`icons.tsx`, `Avatar.tsx`, `PriorityMenu.tsx`, `DateRangePicker.tsx`, `FieldsMenu.tsx`) used consistently across pages to match the Figma reference
