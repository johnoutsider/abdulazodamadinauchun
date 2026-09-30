#!/usr/bin/env bash
# Yangi Ubuntu 22.04/24.04 VPS ni bir marta sozlash. root sifatida ishga tushiring:
#   DOMAIN=example.uz bash setup-server.sh
set -euo pipefail
: "${DOMAIN:?DOMAIN=example.uz ko'rsating}"

apt-get update
apt-get install -y ca-certificates curl git ufw fail2ban nginx certbot python3-certbot-nginx
curl -fsSL https://get.docker.com | sh

ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
systemctl enable --now fail2ban docker

id deploy &>/dev/null || adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
mkdir -p /opt/politeness /var/backups/politeness
chown deploy:deploy /opt/politeness /var/backups/politeness

sed "s/DOMAIN/${DOMAIN}/g" "$(dirname "$0")/nginx.conf" > /etc/nginx/sites-available/politeness
ln -sf /etc/nginx/sites-available/politeness /etc/nginx/sites-enabled/politeness
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "Keyingi qadamlar:"
echo "1) deploy foydalanuvchisiga SSH kalit qo'shing (~deploy/.ssh/authorized_keys)"
echo "2) su - deploy; git clone <repo> /opt/politeness; cd /opt/politeness; cp .env.example .env; .env ni to'ldiring"
echo "3) docker compose up -d --build"
echo "4) certbot --nginx -d ${DOMAIN}"
echo "5) crontab -e (deploy):  0 3 * * * /opt/politeness/deploy/backup.sh"
