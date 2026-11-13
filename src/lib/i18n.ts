import { cookies } from "next/headers";

export type Lang = "uz" | "en";

const dict = {
  uz: {
    appName: "PoliteLingua",
    nav_home: "Bosh sahifa", nav_analyze: "Tahlil", nav_corpus: "Korpus", nav_survey: "So'rovnoma",
    nav_about: "Ilmiy ish haqida", nav_login: "Kirish", nav_register: "Ro'yxatdan o'tish",
    nav_logout: "Chiqish", nav_me: "Kabinet", nav_admin: "Boshqaruv",
    hero_title: "Xushmuomalalik strategiyasini aniqlang",
    hero_sub: "Ingliz yoki o'zbek tilidagi ibora va vaziyatni kiriting: tizim strategiyani, ijtimoiy omillarni va mos variantni ko'rsatadi.",
    cta_analyze: "Tahlilni boshlash", cta_corpus: "Korpusni ko'rish",
    analyze_title: "Til birligini tahlil qilish",
    f_unit: "Til birligi (ibora, gap)", f_unit_ph: "Masalan: Could you please pass me the salt?",
    f_situation: "Vaziyat (kim kimga, qayerda, nima uchun)", f_situation_ph: "Masalan: Talaba professordan kechikish uchun uzr so'ramoqda",
    f_lang: "Til", f_lang_auto: "Avtomatik", f_optional: "Ijtimoiy omillar (ixtiyoriy, aniq bo'lsa)",
    f_submit: "Tahlil qilish", f_loading: "Tahlil qilinmoqda...",
    r_strategy: "Strategiyani yuzaga keltiruvchi vosita", main_strategy: "Asosiy strategiya turi", r_factors: "Ta'sir etuvchi ijtimoiy omillar", r_explain: "Izoh",
    r_example: "Vaziyatga mos misol", r_suggest: "Yaxshiroq variant", r_source: "Manba",
    src_CORPUS: "Korpus (tadqiqotchi tasdiqlagan)", src_AI: "Sun'iy intellekt", src_RULES: "Qoidalarga asoslangan taxmin",
    r_helpful: "Natija foydali bo'ldimi?", r_thanks: "Rahmat!", r_ai_note: "Sun'iy intellekt natijasi taxminiy; ilmiy xulosa uchun tadqiqotchi tekshiruvi kerak.",
    limit_guest: "Mehmon uchun kunlik limit tugadi. Davom etish uchun ro'yxatdan o'ting.",
    limit_user: "Kunlik limit tugadi. Ertaga urinib ko'ring.",
    err_generic: "Xatolik yuz berdi. Qayta urinib ko'ring.", err_short: "Til birligini kiriting.",
    email: "Email", password: "Parol", name: "Ism", age_group: "Yosh guruhi", gender: "Jins", status: "Kasb / maqom",
    native_lang: "Ona tili", login: "Kirish", register: "Ro'yxatdan o'tish",
    bad_login: "Email yoki parol noto'g'ri.", email_taken: "Bu email band.", weak_pw: "Parol kamida 8 belgi bo'lsin.",
    consent: "Ma'lumotlarim ilmiy tadqiqot maqsadida anonim tarzda ishlatilishiga roziman.",
    corpus_title: "Til birliklari korpusi", all: "Hammasi", search: "Qidirish", empty: "Ma'lumot topilmadi.",
    unit: "Strategiyani ifodalovchi vosita", equivalent: "Ekvivalent", col_devices: "Strategiyani yuzaga keltiruvchi vositalar", situation: "Vaziyat", filter: "Saralash",
    survey_title: "So'rovnoma", survey_none: "Hozircha faol so'rovnoma yo'q.", survey_send: "Yuborish", survey_done: "Javobingiz qabul qilindi. Rahmat!",
    me_title: "Mening tahlillarim", me_none: "Hali tahlil qilmagansiz.",
    about_title: "Ilmiy ish haqida",
    about_body: "Ushbu platforma «Ingliz va o'zbek tillarida xushmuomalalikni ifodalovchi til birliklarining sotsiopragmatik xususiyatlari (ijtimoiy tarmoqlar diskursi misolida)» mavzusidagi PhD dissertatsiyasi doirasida yaratilgan. U xushmuomalalik strategiyalari va yosh, gender, ijtimoiy maqom hamda masofa omillarining ta'sirini amalda ko'rsatadi.",
    author: "Muallif", roles_note: "Tizim natijalari ilmiy maqsadda anonim tarzda to'planadi.",
    male: "Erkak", female: "Ayol", other: "Ko'rsatmayman",
    age_18: "18 gacha", age_18_25: "18–25", age_26_40: "26–40", age_41_60: "41–60", age_60: "60 dan katta",
    footer_org: "O'zbekiston davlat jahon tillari universiteti",
    hero_eyebrow: "Brown va Levinson nazariyasi asosida",
    feat1_t: "Strategiyani aniqlash", feat1_d: "Ibora ochiq, ijobiy, salbiy yoki yashirin xushmuomalalik strategiyasiga tasniflanadi.",
    feat2_t: "Ijtimoiy omillar", feat2_d: "Yosh, gender, maqom, masofa va rasmiylikning til tanloviga ta'siri ko'rsatiladi.",
    feat3_t: "Tasdiqlangan korpus", feat3_d: "Natijalar tadqiqotchi tasdiqlagan ingliz va o'zbek tilidagi misollarga tayanadi.",
    steps_title: "Qanday ishlaydi",
    step1: "Ibora va vaziyatni kiriting", step2: "Tizim korpus va sun'iy intellekt yordamida tahlil qiladi", step3: "Strategiya, izoh va yaxshiroq variantni oling",
    analyze_sub: "Iborani va u qo'llangan vaziyatni yozing — natija o'ng tomonda paydo bo'ladi.",
    r_empty: "Natija shu yerda ko'rinadi",
    corpus_sub: "Tadqiqotchi tasdiqlagan ingliz va o'zbek tilidagi xushmuomalalik birliklari.",
    units_count: "ta birlik",
    no_answer: "Ko'rsatilmagan",
  },
  en: {
    appName: "PoliteLingua",
    nav_home: "Home", nav_analyze: "Analyze", nav_corpus: "Corpus", nav_survey: "Survey",
    nav_about: "About the research", nav_login: "Log in", nav_register: "Sign up",
    nav_logout: "Log out", nav_me: "My account", nav_admin: "Admin",
    hero_title: "Identify the politeness strategy",
    hero_sub: "Enter an English or Uzbek expression and a situation: the system shows the strategy, social factors and a better-suited option.",
    cta_analyze: "Start analysis", cta_corpus: "Browse corpus",
    analyze_title: "Analyze a language unit",
    f_unit: "Language unit (phrase, sentence)", f_unit_ph: "e.g. Could you please pass me the salt?",
    f_situation: "Situation (who to whom, where, why)", f_situation_ph: "e.g. A student apologises to a professor for being late",
    f_lang: "Language", f_lang_auto: "Auto-detect", f_optional: "Social factors (optional, if known)",
    f_submit: "Analyze", f_loading: "Analyzing...",
    r_strategy: "Strategy-realising device", main_strategy: "Main strategy type", r_factors: "Influencing social factors", r_explain: "Explanation",
    r_example: "Example for this situation", r_suggest: "Better option", r_source: "Source",
    src_CORPUS: "Corpus (researcher-verified)", src_AI: "Artificial intelligence", src_RULES: "Rule-based estimate",
    r_helpful: "Was this helpful?", r_thanks: "Thanks!", r_ai_note: "AI output is an estimate; scientific conclusions require researcher verification.",
    limit_guest: "Guest daily limit reached. Sign up to continue.",
    limit_user: "Daily limit reached. Try again tomorrow.",
    err_generic: "Something went wrong. Please try again.", err_short: "Enter a language unit.",
    email: "Email", password: "Password", name: "Name", age_group: "Age group", gender: "Gender", status: "Occupation / status",
    native_lang: "Native language", login: "Log in", register: "Sign up",
    bad_login: "Wrong email or password.", email_taken: "This email is already registered.", weak_pw: "Password must be at least 8 characters.",
    consent: "I agree that my data is used anonymously for scientific research.",
    corpus_title: "Corpus of language units", all: "All", search: "Search", empty: "Nothing found.",
    unit: "Strategy-expressing unit", equivalent: "Equivalent", col_devices: "Strategy-realising devices", situation: "Situation", filter: "Filter",
    survey_title: "Survey", survey_none: "No active survey yet.", survey_send: "Submit", survey_done: "Your answers were saved. Thank you!",
    me_title: "My analyses", me_none: "You have not analyzed anything yet.",
    about_title: "About the research",
    about_body: "This platform was built for a PhD dissertation on the sociopragmatic features of politeness-expressing language units in English and Uzbek (based on social media discourse). It demonstrates politeness strategies and the influence of age, gender, social status and distance.",
    author: "Author", roles_note: "Results are collected anonymously for research purposes.",
    male: "Male", female: "Female", other: "Prefer not to say",
    age_18: "Under 18", age_18_25: "18–25", age_26_40: "26–40", age_41_60: "41–60", age_60: "Over 60",
    footer_org: "Uzbekistan State World Languages University",
    hero_eyebrow: "Grounded in Brown & Levinson's theory",
    feat1_t: "Strategy detection", feat1_d: "Each expression is classified as a bald on-record, positive, negative or off-record politeness strategy.",
    feat2_t: "Social factors", feat2_d: "Shows how age, gender, status, distance and formality shape linguistic choice.",
    feat3_t: "Verified corpus", feat3_d: "Results rely on researcher-verified English and Uzbek examples.",
    steps_title: "How it works",
    step1: "Enter an expression and its situation", step2: "The system analyzes it using the corpus and AI", step3: "Get the strategy, an explanation and a better option",
    analyze_sub: "Type the expression and the situation it is used in — the result appears on the right.",
    r_empty: "Results will appear here",
    corpus_sub: "Researcher-verified politeness units in English and Uzbek.",
    units_count: "units",
    no_answer: "Not specified",
  },
} as const;

export type Dict = (typeof dict)["uz"];
export type TKey = keyof Dict;

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get("lang")?.value;
  return v === "en" ? "en" : "uz";
}

export async function getT() {
  const lang = await getLang();
  const d = dict[lang] as Record<string, string>;
  return { lang, t: (k: TKey) => d[k] ?? k };
}

export function dictFor(lang: Lang): Record<string, string> {
  return dict[lang] as Record<string, string>;
}
