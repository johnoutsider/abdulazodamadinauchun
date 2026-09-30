# Xushmuomalalik tahlili platformasi — loyiha rejasi (MVP)

**Buyurtmachi:** Abdullazoda Madina Rasuljon qizi, PhD (O'zDJTU, 10.00.13 — Qiyosiy va chog'ishtirma tilshunoslik)
**Dissertatsiya mavzusi:** Ingliz va o'zbek tillarida xushmuomalalikni ifodalovchi til birliklarining sotsiolingvistik xususiyatlari
**Maqsad:** Seminar/himoyada ilmiy g'oyani amalda ko'rsatib beradigan ixcham veb-platforma
**Texnologiya:** Next.js (App Router) + PostgreSQL + Claude API, VPS serverda joylashtiriladi
**Muddat:** ~1 hafta (seminargacha), byudjet: 100–200 $

---

## 1. Platforma nima qiladi (bir jumlada)

Foydalanuvchi til birligi (ingliz yoki o'zbek) va vaziyatni kiritadi → tizim **qaysi xushmuomalalik strategiyasi** ekanini, **qaysi ijtimoiy omillar** (yosh, gender, ijtimoiy maqom, masofa) ta'sir etishini aniqlaydi, vaziyatga mos **misol** va **yaxshiroq variant** taklif qiladi. Barcha so'rovlar bazaga yoziladi va tadqiqotchi uchun **statistika** hamda **Excel/SPSS eksport** beriladi.

## 2. Ilmiy asos (tizim ichidagi tasnif)

So'rovnomada tasnif ko'rsatilmagan, shuning uchun standart nazariyani asos qilib olamiz. **Tadqiqotchi tasdiqlashi kerak** (o'z dissertatsiyasidagi tasnifga moslash mumkin):

| Bo'lim | Tavsiya etilgan qiymatlar |
|---|---|
| Strategiya (Brown & Levinson) | Bald on-record · Positive politeness · Negative politeness · Off-record · Xushmuomalasiz (impolite) |
| Sub-strategiyalar | Har bir strategiya ichida 3–6 ta (masalan: hedging, ilтимос shakli, minnatdorchilik, murojaat shakli, kompliment...) |
| Ijtimoiy omillar | Yosh (kichik/teng/katta) · Gender (E/A) · Ijtimoiy maqom (past/teng/yuqori) · Masofa (yaqin/notanish/rasmiy) · Vaziyat turi (rasmiy/norasmiy) |
| Til | `en` / `uz` — har bir birlikning ikkinchi tildagi ekvivalenti ham saqlanadi |

Bu tasnif bazada **jadval sifatida** saqlanadi, kodga qattiq yozilmaydi — tadqiqotchi admin paneldan o'zgartira oladi.

## 3. Foydalanuvchi rollari

So'rovnomada "foydalanuvchi va tadqiqotchidan tashqari yana kim kerak?" deb so'ralgan. Tavsiya:

| Rol | Nima qiladi | MVP |
|---|---|---|
| **Mehmon** (ro'yxatsiz) | Bosh sahifani ko'radi, 3 tagacha demo tahlil qiladi | ✅ |
| **Foydalanuvchi** | Ro'yxatdan o'tadi (ism, yosh, gender, kasb/maqom, ona tili), cheksiz tahlil qiladi, tarixini ko'radi, so'rovnomani to'ldiradi | ✅ |
| **Tadqiqotchi (admin)** | Korpusni boshqaradi, barcha tahlillarni va statistikani ko'radi, eksport qiladi, foydalanuvchilarni boshqaradi | ✅ |
| **Ekspert / annotator** | AI qo'ygan strategiyani tekshirib tasdiqlaydi yoki tuzatadi (ilmiy ishonchlilik uchun) | ⏳ keyingi bosqich, agar vaqt qolsa |

Foydalanuvchi profilidagi yosh/gender/maqom ma'lumotlari ilmiy ish uchun muhim: shu orqali "kim qanday strategiyani tanlaydi" statistikasi chiqadi.

## 4. Funksional modullar

### 4.1. Korpus (til birliklari bazasi) — asosiy modul
- Har bir yozuv: matn, til, tarjima/ekvivalent, strategiya, sub-strategiya, ijtimoiy omil teglari, vaziyat tavsifi, misol dialog, manba.
- Admin panel: qo'shish / tahrirlash / o'chirish, qidiruv va filtr.
- **CSV/Excel import** — tadqiqotchi o'z materialini jadval sifatida yuklaydi.
- Ochiq katalog sahifasi: strategiya va til bo'yicha ko'rish.

### 4.2. Tahlil (asosiy "ko'rsatuv" funksiyasi)
- Forma: til birligi + vaziyat (kim kimga, qayerda) + ixtiyoriy omillar (yosh/gender/maqom/masofa).
- Ikki bosqichli aniqlash:
  1. **Korpusdan qidiruv** — aniq yoki yaqin moslik topilsa, bazadagi ilmiy belgilangan javob chiqadi.
  2. **AI (Claude)** — korpusdan eng yaqin 5–10 misol kontekst sifatida beriladi, model strategiya, omillar, misol va yaxshiroq variantni tuzilgan (JSON) shaklda qaytaradi.
- Natija sahifasi: strategiya (izoh bilan), ta'sir etuvchi omillar, vaziyatga mos misollar (ikki tilda), tavsiya etilgan variant, "AI javobi / korpus javobi" belgisi.
- Har bir tahlil bazaga yoziladi (kim, qachon, nima kiritdi, nima chiqdi) — bu tajriba ma'lumotidir.
- Foydalanuvchi "Javob to'g'rimi? 👍/👎" belgilashi mumkin — AI aniqligini o'lchash uchun.

### 4.3. So'rovnoma
- Mavjud Google Sheet natijalarini **CSV orqali import** qilish (tadqiqotchi Sheet'ni CSV qilib yuklaydi).
- Platformaning o'zida qisqa so'rovnoma (vaziyat beriladi → foydalanuvchi qaysi iborani tanlaydi). Savollar admin paneldan tuziladi.

### 4.4. Statistika (tadqiqotchi uchun)
- Strategiyalar taqsimoti: til bo'yicha, gender/yosh/maqom bo'yicha.
- Korpus va tahlillar soni, faol foydalanuvchilar.
- Diagrammalar (ustunli, doiraviy) — seminarda ekranda ko'rsatish uchun.

### 4.5. Eksport
- Tahlillar, so'rovnoma javoblari, korpus → **CSV va XLSX** (SPSS uchun to'g'ri ustun nomlari bilan).

### 4.6. Umumiy
- Ikki tilli interfeys: **o'zbek** (asosiy) va **ingliz**.
- Mobil qurilmalarga mos dizayn.
- Bosh sahifa: loyiha, dissertatsiya mavzusi, muallif haqida qisqa ma'lumot (himoya uchun ko'rinish).

### MVP ga kirmaydi (byudjet va muddat sababli)
Dars materiallari, insho tekshirish, pre/post testlar, Telegram bildirishnomalar, guruhlarga bo'lish. Kerak bo'lsa 2-bosqichda qo'shiladi.

## 5. Texnik stek

| Qatlam | Tanlov | Sabab |
|---|---|---|
| Framework | **Next.js 15** (App Router, TypeScript, Server Actions) | Bitta kodbaza — frontend + backend |
| UI | Tailwind CSS + shadcn/ui | Tez, chiroyli, tayyor komponentlar |
| Ko'p tillilik | next-intl | uz/en tarjimalar |
| Baza | **PostgreSQL** + Prisma ORM | Ishonchli, statistika so'rovlari qulay |
| Autentifikatsiya | Auth.js (email + parol) | Oddiy, tashqi servis kerak emas |
| AI | Claude API (asosiy: `claude-sonnet-5-5`, arzon rejim: `claude-haiku-4-5-20251001`) | Tuzilgan JSON javob, o'zbek tilini yaxshi tushunadi |
| Diagrammalar | Recharts | Next.js bilan oson |
| Eksport | SheetJS (xlsx) | CSV/XLSX |
| Validatsiya | Zod | Formalar va AI javobini tekshirish |
| Deploy | Docker Compose + Nginx + Let's Encrypt | VPS da standart va barqaror |

## 6. Ma'lumotlar bazasi sxemasi (asosiy jadvallar)

```
User            id, email, passwordHash, role(USER|RESEARCHER), name, age, gender, status, nativeLang, createdAt
Strategy        id, code, nameUz, nameEn, descriptionUz, descriptionEn, parentId (sub-strategiya uchun)
SocialFactor    id, type(AGE|GENDER|STATUS|DISTANCE|FORMALITY), value, labelUz, labelEn
Unit            id, text, lang(en|uz), equivalent, strategyId, situation, exampleDialog, source, createdBy
UnitFactor      unitId, factorId               (ko'p-ko'pga bog'lanish)
Analysis        id, userId?, inputText, inputLang, situation, inputFactors(json),
                resultStrategyId, resultFactors(json), resultExample, suggestion,
                source(CORPUS|AI), matchedUnitId?, rawAiResponse(json), feedback(+1/-1), createdAt
Survey          id, title, isActive
SurveyQuestion  id, surveyId, text, options(json), order
SurveyResponse  id, surveyId, userId?, answers(json), importedFrom?, createdAt
```

## 7. Sahifalar ro'yxati

**Ochiq:** `/` bosh sahifa · `/analyze` tahlil · `/corpus` katalog · `/survey` so'rovnoma · `/login` `/register` · `/about` ilmiy ish haqida
**Foydalanuvchi:** `/me` profil va tahlillar tarixi
**Tadqiqotchi:** `/admin` statistika · `/admin/units` korpus · `/admin/strategies` tasnif · `/admin/analyses` barcha tahlillar · `/admin/surveys` · `/admin/users` · `/admin/export`

## 8. VPS ga joylashtirish rejasi

1. **Server:** Ubuntu 22.04/24.04, kamida 2 GB RAM (Docker + Postgres uchun). Domen (masalan `politeness.uz` yoki subdomen) A-yozuvi serverga yo'naltiriladi.
2. **Xavfsizlik:** SSH kalit, `ufw` (faqat 22/80/443), fail2ban, alohida `deploy` foydalanuvchi.
3. **Docker Compose:** `app` (Next.js standalone build) + `db` (postgres:16, volume bilan).
4. **Nginx** reverse proxy → `app:3000`, **Certbot** orqali HTTPS.
5. **Muhit o'zgaruvchilari** (`.env`, gitga kirmaydi): `DATABASE_URL`, `AUTH_SECRET`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SITE_URL`.
6. **CI/CD:** GitHub Actions — `main` ga push bo'lganda SSH orqali serverda `git pull && docker compose up -d --build`.
7. **Zaxira nusxa:** har kuni `pg_dump` cron orqali, 7 kunlik saqlash.
8. **Monitoring:** `docker compose logs`, uptime tekshiruvi (ixtiyoriy).

## 9. Ish bosqichlari va muddat (7 kunlik sprint)

| Kun | Ish | Natija |
|---|---|---|
| 1 | Loyiha skeleti: Next.js, Tailwind, Prisma, Postgres (Docker), Auth, uz/en, bazaviy layout | Login/registratsiya ishlaydi |
| 2 | Strategiya va ijtimoiy omillar tasnifi, korpus CRUD + CSV import (admin) | Tadqiqotchi materialini yuklay oladi |
| 3 | Tahlil moduli: korpus qidiruv + Claude integratsiyasi, natija sahifasi, saqlash | Asosiy demo tayyor |
| 4 | So'rovnoma moduli + Google Sheet CSV import, foydalanuvchi profili/tarixi | Ma'lumot yig'ish ishlaydi |
| 5 | Statistika sahifasi, diagrammalar, CSV/XLSX eksport | Tadqiqotchi paneli tayyor |
| 6 | VPS sozlash, Docker, Nginx, SSL, CI/CD, zaxira nusxa | Sayt internetda |
| 7 | Sinov, xatolarni tuzatish, tadqiqotchi bilan ko'rib chiqish, seminar uchun demo ma'lumotlar | Topshirish |

Bufer: +2–3 kun (tasnif va materiallar kech kelsa).

## 10. Byudjet taqsimoti (taxminiy)

| Modda | Summa |
|---|---|
| Ishlab chiqish (MVP, 7 kun) | 100–200 $ (kelishilgan chegara) |
| VPS (oyiga) | 5–10 $ |
| Domen (yiliga) | 5–15 $ |
| Claude API (oyiga, ~1000 tahlil) | 2–5 $ (Haiku) / 10–20 $ (Sonnet) |

AI xarajatini nazorat qilish uchun: mehmonga kunlik limit, javoblarni keshlash (bir xil so'rov → bazadan).

## 11. Xavflar va ochiq savollar (tadqiqotchidan aniqlash kerak)

1. **Tasnif:** Brown & Levinson tasnifi mosmi yoki dissertatsiyada o'ziga xos tasnif bormi? Sub-strategiyalar ro'yxati kerak.
2. **Korpus materiali:** til birliklari qanday shaklda (Word, Excel)? Taxminan nechta? Bu bazaga import qilinadi.
3. **Google Sheet so'rovnomasi:** ustunlar qanday? CSV ko'rinishida yuborish kerak.
4. **Sana:** hujjatda 14.09.2026 yozilgan — seminarning aniq sanasi qachon?
5. **Interfeys tili:** o'zbek + ingliz yetarlimi, rus kerakmi?
6. **VPS:** provayder, OS, root kirish bormi? Domen sotib olinganmi?
7. **AI javobi ilmiy ishda:** AI natijasi "taxminiy" deb belgilanadi; ekspert tasdiqlash roli kerakmi?
8. **Ma'lumotlar maxfiyligi:** ishtirokchilardan rozilik matni (consent) kerak — bosh sahifada ko'rsatiladi.

## 12. Keyingi qadam

Yuqoridagi 11-bo'limdagi savollarga javob olingach, 1-kun ishi (loyiha skeleti) boshlanadi. Kod yozish tasdiqdan keyin.
