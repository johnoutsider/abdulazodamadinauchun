"use server";
import { revalidatePath } from "next/cache";
import { requireResearcher } from "@/lib/auth";
import { AI_INSTRUCTIONS_KEY, deleteSetting, setSetting } from "@/lib/settings";

export type AiMsg = { ok?: "ai_saved" | "ai_reset_done"; error?: "ai_too_long" } | undefined;

export async function saveAiInstructions(_: AiMsg, fd: FormData): Promise<AiMsg> {
  const user = await requireResearcher();
  if (fd.get("intent") === "reset") {
    await deleteSetting(AI_INSTRUCTIONS_KEY);
    revalidatePath("/ai-instructions");
    return { ok: "ai_reset_done" };
  }
  const text = String(fd.get("instructions") ?? "").trim();
  if (text.length > 8000) return { error: "ai_too_long" };
  if (!text) await deleteSetting(AI_INSTRUCTIONS_KEY);
  else await setSetting(AI_INSTRUCTIONS_KEY, text, user.id);
  revalidatePath("/ai-instructions");
  return { ok: "ai_saved" };
}
