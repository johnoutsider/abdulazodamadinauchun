# Xushmuomalalik tahlili platformasi

PhD dissertatsiyasi uchun MVP: ingliz va o'zbek tillaridagi xushmuomalalik birliklarini tahlil qiladi, strategiyani va ijtimoiy omillarni (yosh, gender, maqom, masofa, rasmiylik) aniqlaydi, misol va yaxshiroq variant beradi, natijalarni statistika va Excel/SPSS eksport bilan tadqiqotchiga taqdim etadi.

Reja: [REJA.md](REJA.md). Stek: Next.js 16, PostgreSQL, Tailwind, Recharts, Claude API.

## Tahlil qanday ishlaydi
1. Kiritilgan birlik korpusda aniq topilsa, tadqiqotchi tasdiqlagan javob qaytadi (manba: korpus).
2. Aks holda `ANTHROPIC_API_KEY` bo'lsa Claude ishlaydi; korpusdan eng yaqin misollar kontekst sifatida beriladi (manba: AI).
3. Kalit yo'q yoki AI xato bersa, kalit so'zlarga asoslangan qoidalar ishlaydi (manba: qoidalar).

Har bir tahlil bazaga yoziladi. Mehmon kuniga 3 ta, ro'yxatdan o'tgan foydalanuvchi 50 ta tahlil qila oladi.

## Mahalliy ishga tushirish
```bash
npm install
cp .env.example .env.local        # DATABASE_URL, SESSION_SECRET, ADMIN_* ni to'ldiring
npm run db:migrate                # jadvallar, tasnif, namunaviy korpus, admin akkaunt
npm run dev
```
Admin (tadqiqotchi) akkaunti `ADMIN_EMAIL` / `ADMIN_PASSWORD` dan yaratiladi. Namunaviy 16 ta birlikni qo'shmaslik uchun `SEED_SAMPLES=0`.

## VPS ga joylashtirish (Ubuntu 22.04/24.04, kamida 2 GB RAM)
1. Domenning A-yozuvini server IP ga yo'naltiring.
2. Serverda root sifatida: `DOMAIN=example.uz bash deploy/setup-server.sh` (Docker, Nginx, firewall, fail2ban, `deploy` foydalanuvchi).
3. `deploy` foydalanuvchisi bilan: repo ni `/opt/politeness` ga klonlang, `cp .env.example .env`, qiymatlarni to'ldiring (parol va `SESSION_SECRET` uchun `openssl rand -hex 32`).
4. `docker compose up -d --build` — baza, migratsiya va ilova ishga tushadi.
5. `sudo certbot --nginx -d example.uz` — HTTPS.
6. Zaxira: `crontab -e` → `0 3 * * * /opt/politeness/deploy/backup.sh` (7 kun saqlanadi).
7. Avtomatik yangilash: GitHub Secrets ga `VPS_HOST` va `VPS_SSH_KEY` qo'shing; `main` ga push qilinganda `.github/workflows/ci.yml` tekshiradi va deploy qiladi.

## Korpusni yuklash
Admin → Korpus → CSV/Excel import. Ustunlar: `db/units-template.csv`. Strategiya kodlari Admin → Tasnif sahifasida.

## Google Sheet so'rovnomasi
Sheet'da Fayl → Yuklab olish → CSV. Admin → So'rovnomalar → avval so'rovnoma yarating, keyin faylni import qiling. Har bir qator bitta respondent, ustun sarlavhasi savol sifatida saqlanadi.
