import Papa from "papaparse";
import * as XLSX from "xlsx";

export type Row = Record<string, string>;

// CSV yoki XLSX faylni qatorlar massiviga aylantiradi (birinchi qator — sarlavha)
export async function parseTable(file: File): Promise<Row[]> {
  if (file.size > 5 * 1024 * 1024) throw new Error("Fayl 5 MB dan katta");
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]], { defval: "" });
    return rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k.trim(), String(v).trim()])));
  }
  const text = (await file.text()).replace(/^﻿/, "");
  const res = Papa.parse<Row>(text, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim() });
  return res.data.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? "").trim()])));
}

export function toCsv(rows: Record<string, unknown>[]): string {
  return "﻿" + Papa.unparse(rows.map((r) => Object.fromEntries(
    Object.entries(r).map(([k, v]) => [k, v !== null && typeof v === "object" ? JSON.stringify(v) : v]))));
}

export function toXlsx(rows: Record<string, unknown>[], sheet = "data"): Buffer {
  const flat = rows.map((r) => Object.fromEntries(
    Object.entries(r).map(([k, v]) => [k, v !== null && typeof v === "object" ? JSON.stringify(v) : v])));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(flat), sheet);
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}
