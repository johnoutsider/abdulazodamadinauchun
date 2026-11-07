#!/usr/bin/env bash
# GitHub Actions'siz avtomatik deploy: har daqiqada main ni tekshiradi,
# yangi commit bo'lsa deploy.sh ni ishga tushiradi. deploy foydalanuvchisi crontab'i:
#   * * * * * bash /opt/politeness/deploy/auto-update.sh >> /home/deploy/auto-deploy.log 2>&1
set -euo pipefail
cd /opt/politeness

# Bir vaqtda faqat bitta deploy
exec 9>/tmp/politeness-deploy.lock
flock -n 9 || exit 0

git fetch -q origin "${BRANCH:-main}"
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/${BRANCH:-main}")
[ "$LOCAL" = "$REMOTE" ] && exit 0

echo "$(date -Is) yangilanish: ${LOCAL:0:7} -> ${REMOTE:0:7}"
bash deploy/deploy.sh
echo "$(date -Is) tayyor: $(git rev-parse --short HEAD)"
