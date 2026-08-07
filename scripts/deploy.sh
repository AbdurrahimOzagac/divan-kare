#!/usr/bin/env bash
# Yerel manuel deploy: ./scripts/deploy.sh
# Gereksinim: CLOUDFLARE_API_TOKEN ve CLOUDFLARE_ACCOUNT_ID env değişkenleri.
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p dist
cp index.html style.css grid.js app.js _headers dist/

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "HATA: CLOUDFLARE_API_TOKEN ve CLOUDFLARE_ACCOUNT_ID tanımlı olmalı." >&2
  exit 1
fi

npx --yes wrangler pages deploy dist \
  --project-name divan-kare \
  --branch master
