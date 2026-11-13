import { one, query } from "./db";

export const AI_INSTRUCTIONS_KEY = "ai_instructions";

// SI buyruqlarining standart matni (tadqiqotchi o'zgartirmaguncha ishlatiladi)
export const DEFAULT_AI_INSTRUCTIONS = `You are a sociopragmatics assistant for a PhD study of politeness in English and Uzbek, based on social media discourse (Brown & Levinson framework).
Classify a language unit into ONE strategy from the list, infer which social factors are at play in the described situation, give an example utterance suited to the situation, and a better-suited alternative if the given phrasing is not ideal for the situation.`;

export async function getSetting(key: string): Promise<{ value: string; updated_at: Date; updated_by_name: string | null } | null> {
  return one(
    `SELECT s.value, s.updated_at, u.name AS updated_by_name
     FROM settings s LEFT JOIN users u ON u.id = s.updated_by WHERE s.key = $1`, [key]);
}

export async function setSetting(key: string, value: string, userId: number) {
  await query(
    `INSERT INTO settings (key, value, updated_by, updated_at) VALUES ($1, $2, $3, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()`,
    [key, value, userId]);
}

export async function deleteSetting(key: string) {
  await query("DELETE FROM settings WHERE key = $1", [key]);
}

export async function getAiInstructions(): Promise<string> {
  try {
    const s = await getSetting(AI_INSTRUCTIONS_KEY);
    return s?.value.trim() || DEFAULT_AI_INSTRUCTIONS;
  } catch {
    return DEFAULT_AI_INSTRUCTIONS; // jadval hali yaratilmagan bo'lsa
  }
}
