Deployment guide — recommended split deploy (stable)

Goal

- Deploy the Next frontend to Vercel (fast, serverless static + SSR) and deploy the Payload server to a long-running Node host (Render/Railway/Fly). This approach is reliable, supports uploads, and avoids many serverless edge cases.

Why this approach

- Payload is a stateful Node server (uploads, long-running processes). Running it on a Node host avoids serverless cold-starts or native module issues (sharp) and gives predictable behavior.
- Next works great on Vercel and is optimized for it. Keep frontend on Vercel, backend on Render/Railway.

Required environment variables (both projects)

- PAYLOAD_SECRET: a strong secret used by Payload.
- DATABASE_URI or MONGODB_URI: MongoDB connection string (use a managed MongoDB like Atlas).
- NEXT_PUBLIC_SERVER_URL: the public URL of the Payload server (e.g. https://payload.example.com). Set this in Vercel.

Backend (Payload) — Render example

1. Create a new Web Service in Render (or use Railway/Fly). Use Docker or the provided build command.
2. Repo: point Render to this repository path: `StrapiPrjct/payload-backend`.
3. Build & Start commands (Render):
   - Build Command: `pnpm install --frozen-lockfile && pnpm generate:types && pnpm build`
   - Start Command: `pnpm start` or `pnpm dev` for development.
4. Environment variables (in Render UI):
   - PAYLOAD_SECRET
   - DATABASE_URI (MongoDB)
   - NEXT_PUBLIC_SERVER_URL (set to your frontend URL later)
   - Any other env used in `.env` (e.g., SMTP, cloud buckets)
5. If using Docker, the included `Dockerfile` should work — set `DATABASE_URI` and `PAYLOAD_SECRET` in service settings.
6. Verify logs: the server should log "Connected to MongoDB server successfully!" and "Payload running..." and show admin/API routes.

Frontend (Next) — Vercel

1. Create a Vercel project pointing to the same repo path: `StrapiPrjct/payload-backend`.
2. In Vercel project settings, set the following env vars:
   - NEXT_PUBLIC_SERVER_URL=https://<your-payload-host>
   - PAYLOAD_SECRET (not strictly needed for static frontend but safe to set)
   - DATABASE_URI is NOT required for Vercel when frontend only — backend will hold DB.
3. Build & Install commands in `vercel.json` are already set to use pnpm. Ensure Vercel uses Node version compatible with `package.json` engines.
4. Deploy and verify `/admin` and frontend pages.

Single-Vercel (not recommended)

- If you still want to run everything on Vercel serverless, ensure:
  - Vercel project env includes PAYLOAD_SECRET and DATABASE_URI (Mongo).
  - Node version and pnpm are configured.
  - Pin `sharp` to a supported version or use `@vercel/static-build` patterns. Expect extra troubleshooting.

GitHub Actions template (optional)

- See `.github/workflows/deploy-templates.yml` (example in repo) — configure `VERCEL_TOKEN` and `RENDER_API_KEY` secrets and set the deployment steps.

Support

- If you want, I can:
  - Produce GitHub Actions workflow files for automated deploys to Vercel and Render (requires you to provide secrets in the repository settings).
  - Attempt a local build to reproduce the exact Vercel deploy errors you've seen and fix them.
