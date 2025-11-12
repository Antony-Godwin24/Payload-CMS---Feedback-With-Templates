# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  # Run Next build directly to avoid relying on cross-env wrapper in package scripts
  # which can fail in some multi-stage copy setups. NODE_OPTIONS is set inline.
  if [ -f node_modules/.bin/next ]; then \
  NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" ./node_modules/.bin/next build --webpack; \
  elif [ -f yarn.lock ]; then \
  NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" yarn build; \
  elif [ -f package-lock.json ]; then \
  NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
  corepack enable pnpm && NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove this line if you do not have this folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next
# Copy node_modules and build output from the builder stage.
# The project may produce a `standalone` output (server.js + minimal deps)
# or just the regular `.next` directory. We'll copy both and decide at
# container start which to run.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/server.js ./server.js

# Add a tiny entrypoint script that will run the standalone server.js when
# present (output: 'standalone') or fall back to `next start` for the
# regular build output.
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Entrypoint will choose correct command depending on build output.
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
