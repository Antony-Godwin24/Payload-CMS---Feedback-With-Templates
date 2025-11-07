# Feedback & Rating Platform (Payload CMS + Next.js)

Unified application that bundles the Payload CMS admin, REST APIs, and a modern customer-facing Next.js 15 frontend. Customers can browse template listings, view live demos, submit star ratings, and leave feedback. Content editors manage templates and feedback directly from the Payload admin UI at `/admin`.

## ✨ Features

- Template marketplace with images, pricing, demo URLs, categories, tags, and publish workflow
- Interactive template listing (`/templates`) with category filters, live demo buttons, and rating overlays
- Template detail views (`/templates/[id]`) with live rating summaries, feedback list, and feedback submission form
- Feedback moderation workflow (approved/pending/rejected) synced automatically with template rating aggregates
- Payload Admin UI mounted at `/admin` using the official `@payloadcms/next` integration
- Flexible database layer: SQLite for local development, MongoDB Atlas for production hosting (Vercel ready)

## 📁 Project Structure

```
payload-backend/
├── public/                      # Static assets served by Next.js
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── templates/
│   │   │   ├── page.tsx         # Template catalogue
│   │   │   └── [id]/page.tsx    # Template detail + feedback
│   │   ├── feedback/page.tsx    # Feedback CTA page
│   │   └── (payload)/…          # Payload admin + APIs
│   ├── components/              # Reusable UI (cards, forms, ratings…)
│   ├── lib/payload-api.ts       # Client-side API helpers
│   ├── collections/             # Payload collections (Templates, Feedbacks, Media, Users)
│   └── payload.config.ts        # Payload configuration
├── next.config.mjs              # Next.js configuration (standalone build)
├── package.json
├── pnpm-lock.yaml
└── vercel.json                  # Build commands for Vercel
```

## 🧩 Prerequisites

- Node.js **18.20+** or **20.9+**
- pnpm **9+** (recommended) or npm
- SQLite (bundled) for local development — no additional setup required
- MongoDB Atlas cluster for production deployment (optional but recommended)

## ⚙️ Environment Variables

Create a `.env.local` file for local development and configure the following keys:

```env
# Required in all environments
PAYLOAD_SECRET=dev-secret-change-me
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional (only needed when you want to force SQLite to a custom path)
# SQLITE_DB_PATH=../.payload/data.db   # customise SQLite location
# SQLITE_DB_PATH=../payload-backend.db

# Leave DATABASE_URI unset locally to use SQLite
# DATABASE_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/database
```

Optional overrides:
```env
# SQLITE_DB_PATH=../.payload/data.db   # customise SQLite location
```

> Tip: keep the database outside synced folders (the default `.payload/` path avoids OneDrive locks).

For **production / Vercel deployment**, set:

- `PAYLOAD_SECRET` – a long random string
- `NEXT_PUBLIC_SERVER_URL` – `https://your-vercel-domain.vercel.app`
- `DATABASE_URI` – MongoDB Atlas connection string (`mongodb+srv://…`)

When `DATABASE_URI` or `MONGODB_URI` is provided with a Mongo connection string, Payload transparently switches to the Mongo adapter. Otherwise it falls back to SQLite using `payload-backend.db` (ignored by git).

## 🚀 Development Workflow

```bash
pnpm install               # install dependencies
pnpm generate:types        # sync Payload types (run whenever collections change)
pnpm dev                   # start Next.js + Payload on http://localhost:3000
```

On first run:

1. Visit `http://localhost:3000/admin`
2. Register the first admin user
3. Create templates and upload media

## 🧱 Available Scripts

| Script               | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `pnpm dev`           | Next.js dev server + Payload CMS                        |
| `pnpm build`         | Production build (`next build`)                         |
| `pnpm start`         | Start production server (`next start`)                  |
| `pnpm generate:types`| Regenerate `payload-types.ts`                           |
| `pnpm lint`          | Run Next.js ESLint                                      |
| `pnpm test`          | Runs existing vitest + Playwright suites (optional)     |

## 📦 Deployment (Vercel)

1. Push the project to GitHub/GitLab/Bitbucket
2. Create a new Vercel project and import the repo
3. Configure environment variables in Vercel → **Project Settings → Environment Variables**:
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SERVER_URL` (e.g. `https://your-app.vercel.app`)
   - `DATABASE_URI` (MongoDB Atlas)
4. Vercel will run `pnpm install` followed by `pnpm generate:types && pnpm build` (see `vercel.json`)
5. Trigger a deployment — the admin interface is available at `/admin`

## 🗃️ SQLite vs MongoDB

- **Local**: leave `DATABASE_URI` empty — Payload uses a file-based SQLite DB (`payload-backend.db`).
- **Production**: provide a Mongo connection string via `DATABASE_URI` and Payload switches to the Mongo adapter automatically.
- The SQLite file is ignored via `.gitignore`. Delete it (`payload-backend.db`) whenever you want a fresh local dataset.
- Local development defaults to SQLite at `payload-backend/.payload/data.db` (auto-created)
- Production deployments (Vercel) use MongoDB Atlas via `DATABASE_URI`

## 🔗 Helpful Routes

- `/`"# Payload-CMS---Feedback-With-Templates" 
