# To-Do List App — MERN (SDE-1 assignment)

A task manager with weekly organisation, built as a **web app**: React + Vite front-end with a
mobile-first UI that follows the supplied Figma, a responsive desktop layout on top of it, and its
own Express + MongoDB API.

| | |
| --- | --- |
| **Live app** | https://todo-list-mern-maaz.netlify.app |
| **API** | https://todo-list-mern-uhpa.onrender.com |
| **Repository** | https://github.com/maazwaheed123/todo-list-mern |

The API runs on Render's free tier, which sleeps after 15 minutes of inactivity — the first request
after a quiet spell can take 30–50 seconds while it wakes up. Data lives in MongoDB Atlas.

```
todo-app/
├── client/          React 18 + Vite + Tailwind (deploy to Netlify)
└── server/          Express + Mongoose REST API (deploy to Render / Railway / Fly)
```

---

## Features

**Task management**
- Create tasks — title (required), description, date & time (required), end time, priority
- Edit any attribute from the same sheet/dialog
- Delete, with a confirmation step; on touch devices a task can also be **swiped left** to reveal Delete
- Keyword search across title *and* description, served by the API, with status filters

**Home screen**
- Monday → Sunday week strip with per-day task dots and prev/next week navigation
- "Task Complete" / "Task Pending" summary cards for the selected week
- Weekly progress bar
- "Tasks Today" list (or the selected day), plus "View All"

**Weeks screen**
- One card per week that holds tasks, with open / completed counts and a progress bar
- Tapping a card expands it to show every task in that week

**Status**
- The checkbox toggles Completed ↔ Open; the edit form also exposes **In progress**
- Completed tasks are struck through and immediately update the week's counts

---

## Running locally

Requires Node 18+. MongoDB is optional in development (see note below).

```bash
# 1. API
cd server
cp .env.example .env        # adjust MONGODB_URI if needed
npm install
npm run dev                 # http://localhost:4000

# 2. Front-end (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

Optional demo data, with the API running:

```bash
cd server && npm run seed
```

In development Vite proxies `/api` to `http://localhost:4000`, so no front-end env var is needed.

> **No MongoDB installed?** The API connects to `MONGODB_URI` first; if that fails it falls back to a
> local JSON file (`server/data/tasks.json`) so the app still runs. The fallback is development-only —
> set `ALLOW_FILE_FALLBACK=false` to make a bad connection a hard failure. MongoDB (Mongoose models,
> validation, text index) is the real data layer: `server/src/models/Task.js`,
> `server/src/store/mongoRepo.js`.

---

## API

Base URL: `/api`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/health` | Service status + which store is active |
| GET | `/tasks` | List tasks. Query: `search`, `status`, `from`, `to` |
| POST | `/tasks` | Create a task |
| GET | `/tasks/:id` | Single task |
| PATCH | `/tasks/:id` | Update any field |
| PATCH | `/tasks/:id/status` | Set `open` \| `in_progress` \| `completed` |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/tasks/summary/weeks` | Per-week open / completed counts (Mon→Sun) |

Task shape:

```json
{
  "id": "6730f1...",
  "title": "Finishing Wireframe",
  "description": "Wrap up the mobile wireframe",
  "dueAt": "2026-11-14T09:00:00.000Z",
  "endAt": "2026-11-14T11:00:00.000Z",
  "priority": "low | medium | high",
  "status": "open | in_progress | completed",
  "completedAt": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

Errors come back as `{ "error": "message" }` with 400 / 404 / 500.

---

## Deployment

**API** (Render, Railway, Fly, …)
1. Create a MongoDB Atlas cluster and copy its connection string.
2. Deploy the `server/` folder — build `npm install`, start `npm start`.
3. Environment: `MONGODB_URI`, `ALLOW_FILE_FALLBACK=false`, `CORS_ORIGIN=https://<your-netlify-site>.netlify.app`.

**Front-end** (Netlify)
1. Connect the repository; `netlify.toml` already sets base `client`, build `npm run build`, publish `dist`,
   and the SPA redirect.
2. Environment: `VITE_API_URL=https://<your-api-host>/api`.

---

## Tech notes

- **Weeks run Monday → Sunday** everywhere (`server/src/utils/week.js`, `client/src/utils/date.js`).
- The store sits behind a small repository interface (`list / get / create / update / remove`), so the
  Mongo and fallback implementations are interchangeable and the controllers stay thin.
- Status changes and deletes are optimistic in the UI and roll back if the request fails.
- Tailwind carries the design tokens (brand blue, ink greys, card shadows) in `client/tailwind.config.js`.
- The same components serve both layouts: below `md` the mobile design (sheet, bottom nav, floating +),
  from `md` up a sidebar layout with a centred dialog.
