#!/bin/sh
set -e

# If the standalone server file exists (created when next.config output: 'standalone')
# run it. Otherwise, run `next start` from node_modules (regular build output).
if [ -f ./server.js ]; then
  echo "Starting Next standalone server (server.js)..."
  exec node server.js
else
  echo "Starting Next using 'next start' (regular build)..."
  # Ensure next binary exists
  if [ -x "./node_modules/.bin/next" ]; then
    exec ./node_modules/.bin/next start -p "${PORT:-3000}"
  else
    echo "ERROR: next binary not found in node_modules."
    exit 1
  fi
fi
