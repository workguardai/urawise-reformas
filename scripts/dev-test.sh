#!/bin/sh
# Local test server on the Urawise EU test database (never the live one), read from the app's .env.local next to this
# project. No RESEND_API_KEY, so test requests are saved but not emailed. Usage: scripts/dev-test.sh [port]
cd "$(dirname "$0")/.."
APP_ENV="../urawise/.env.local"
DATABASE_URL="$(node --env-file="$APP_ENV" -e "process.stdout.write(process.env.EU_DEV_DATABASE_URL || '')")"
if [ -z "$DATABASE_URL" ]; then echo "EU_DEV_DATABASE_URL missing in $APP_ENV" >&2; exit 1; fi
export DATABASE_URL
exec ./node_modules/.bin/next dev -p "${1:-3100}"
