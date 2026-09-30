#!/usr/bin/env bash
# Serverda yangilash: git pull + qayta qurish
set -euo pipefail
cd /opt/politeness
git pull --ff-only origin "${BRANCH:-main}"
docker compose up -d --build
docker image prune -f
