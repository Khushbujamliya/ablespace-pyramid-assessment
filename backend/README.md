# Pyramid — Backend

NestJS API for the Pyramid task management app, backed by MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the `backend` folder with:
   ```
   MONGODB_URI=<your MongoDB connection string>
   JWT_SECRET=<a random secret string for signing JWTs>
   GOOGLE_CLIENT_ID=<your Google OAuth client ID>
   GOOGLE_CLIENT_SECRET=<your Google OAuth client secret>
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   FRONTEND_URL=http://localhost:3001
   ```

   For Google OAuth to work, create credentials in [Google Cloud Console](https://console.cloud.google.com/) and add both your local and production callback URLs to the **Authorized redirect URIs** list.

3. Run the dev server:
   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000`.

## Deployment

This backend is deployed on Render. The following environment variables are set in the Render dashboard for production:

- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` — set to the production backend URL's `/auth/google/callback` path
- `FRONTEND_URL` — set to the production frontend URL (used for OAuth redirect back to the app)

CORS is configured in `src/main.ts` to allow requests from both the local frontend and the production Vercel URL.

## API Overview

- `POST /auth/guest` — guest login, returns a JWT
- `GET /auth/google`, `GET /auth/google/callback` — Google OAuth flow
- `GET/POST/PATCH/DELETE /projects` — project CRUD
- `GET/POST/PATCH/DELETE /tasks` — task CRUD, including subtasks via `parentTaskId`
- `GET /tasks/:id/subtasks` — fetch subtasks for a task
- `GET /tasks/:id/activity` — activity log for a task
- `GET/PATCH /users/me` — current user profile

## Key Structure

- `src/auth/` — guest + Google OAuth strategies, JWT guard
- `src/users/` — user schema and profile endpoints
- `src/projects/` — project schema, CRUD service/controller
- `src/tasks/` — task schema, CRUD service/controller, subtasks
- `src/activity/` — auto-logged activity feed per task
