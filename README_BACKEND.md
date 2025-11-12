# Payload Backend (Templates + Feedback)

This is the backend for the Templates + Feedback demo using Payload CMS + Next.js.

## Quick start (local)

1. Install dependencies (pnpm is recommended):

```cmd
cd /d "c:\Users\ri3ha\OneDrive\Documents\INTERNSHIP\amizhth\Tasks\PayLoad CMS\StrapiPrjct\payload-backend"
pnpm install
```

2. Copy `.env.example` to `.env` and update values as needed (PAYLOAD_SECRET is required):

```cmd
copy .env.example .env
# then edit .env in an editor and set PAYLOAD_SECRET
```

3. Start the dev server (Next + Payload):

```cmd
pnpm run dev
```

Admin UI: http://localhost:3000/admin

4. (Optional) Seed demo data after the server is running:

```cmd
pnpm run seed
```

This will create a couple of templates and feedback entries using the server's REST API.

## Build / Production

Run production build and start:

```cmd
pnpm run build
pnpm start
```

For production you should use a hosted MongoDB instance and set `DATABASE_URI` to the Mongo connection string. Ensure `PAYLOAD_SECRET` is set to a strong secret.

## Notes

- `.env` is ignored by git. Do not commit secrets.
- If you deploy the Next frontend to Vercel, the backend should run on a long-running host (Render, Railway, Fly, etc.). Vercel serverless may not support local SQLite storage.
