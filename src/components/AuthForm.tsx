"use client";
import { useActionState } from "react";
import type { AuthState } from "@/app/actions";

type Labels = Record<string, string>;

export default function AuthForm({ action, t, mode }: {
  action: (s: AuthState, fd: FormData) => Promise<AuthState>; t: Labels; mode: "login" | "register";
}) {
  const [state, act, pending] = useActionState(action, undefined);
  const input = "mt-1 w-full rounded-lg border p-2";
  return (
    <form action={act} className="mx-auto max-w-md space-y-3 rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">{mode === "login" ? t.login : t.register}</h1>
      {mode === "register" && (
        <label className="block">{t.name}<input name="name" required maxLength={100} className={input} /></label>
      )}
      <label className="block">{t.email}<input name="email" type="email" required autoComplete="email" className={input} /></label>
      <label className="block">{t.password}
        <input name="password" type="password" required minLength={mode === "register" ? 8 : 1}
          autoComplete={mode === "login" ? "current-password" : "new-password"} className={input} />
      </label>
      {mode === "register" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">{t.age_group}
              <select name="age_group" className={input}>
                <option value="">{t.no_answer}</option>
                {["age_18", "age_18_25", "age_26_40", "age_41_60", "age_60"].map((k) => <option key={k} value={k}>{t[k]}</option>)}
              </select>
            </label>
            <label className="block">{t.gender}
              <select name="gender" className={input}>
                <option value="">{t.no_answer}</option>
                <option value="male">{t.male}</option><option value="female">{t.female}</option><option value="other">{t.other}</option>
              </select>
            </label>
          </div>
          <label className="block">{t.status}<input name="status" maxLength={100} className={input} /></label>
          <label className="block">{t.native_lang}<input name="native_lang" maxLength={50} className={input} /></label>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="consent" required className="mt-1" />{t.consent}</label>
        </>
      )}
      {state?.error && <p className="rounded bg-red-50 p-2 text-sm text-red-800">{t[state.error]}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-indigo-700 py-2.5 font-semibold text-white hover:bg-indigo-800 disabled:opacity-60">
        {mode === "login" ? t.login : t.register}
      </button>
    </form>
  );
}
