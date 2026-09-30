#!/usr/bin/env bash
# Kunlik zaxira nusxa: 7 kun saqlanadi
set -euo pipefail
cd /opt/politeness
OUT=/var/backups/politeness/db-$(date +%F).sql.gz
docker compose exec -T db pg_dump -U politeness politeness | gzip > "$OUT"
find /var/backups/politeness -name 'db-*.sql.gz' -mtime +7 -delete
