import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { STRATEGIES, FACTORS, SAMPLE_UNITS } from "../db/seed-data";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(readFileSync(join(process.cwd(), "db/schema.sql"), "utf8"));

  // strategiyalar: avval asosiylari, keyin sub-strategiyalar
  for (const s of STRATEGIES.filter((x) => !x.parent)) {
    await pool.query(
      `INSERT INTO strategies (code,name_uz,name_en,desc_uz,desc_en) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (code) DO NOTHING`,
      [s.code, s.uz, s.en, s.descUz, s.descEn],
    );
  }
  for (const s of STRATEGIES.filter((x) => x.parent)) {
    await pool.query(
      `INSERT INTO strategies (code,name_uz,name_en,desc_uz,desc_en,parent_id)
       VALUES ($1,$2,$3,$4,$5,(SELECT id FROM strategies WHERE code=$6))
       ON CONFLICT (code) DO NOTHING`,
      [s.code, s.uz, s.en, s.descUz, s.descEn, s.parent],
    );
  }
  for (const f of FACTORS) {
    await pool.query(
      `INSERT INTO factors (type,value,label_uz,label_en) VALUES ($1,$2,$3,$4)
       ON CONFLICT (type,value) DO NOTHING`,
      [f.type, f.value, f.uz, f.en],
    );
  }

  const { rows } = await pool.query("SELECT count(*)::int AS n FROM units");
  if (rows[0].n === 0 && process.env.SEED_SAMPLES !== "0") {
    for (const u of SAMPLE_UNITS) {
      const r = await pool.query(
        `INSERT INTO units (text,lang,equivalent,strategy_id,situation,example,source)
         VALUES ($1,$2,$3,(SELECT id FROM strategies WHERE code=$4),$5,$6,'namuna') RETURNING id`,
        [u.text, u.lang, u.eq, u.strategy, u.situation, u.example],
      );
      for (const [type, value] of Object.entries(u.factors)) {
        await pool.query(
          `INSERT INTO unit_factors (unit_id,factor_id)
           SELECT $1, id FROM factors WHERE type=$2 AND value=$3 ON CONFLICT DO NOTHING`,
          [r.rows[0].id, type, value],
        );
      }
    }
  }

  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  if (email && pass) {
    await pool.query(
      `INSERT INTO users (email,password_hash,role,name) VALUES ($1,$2,'RESEARCHER','Tadqiqotchi')
       ON CONFLICT (email) DO UPDATE SET role='RESEARCHER', password_hash=EXCLUDED.password_hash`,
      [email.toLowerCase(), await bcrypt.hash(pass, 10)],
    );
    console.log("Admin:", email);
  }
  console.log("Migratsiya tugadi");
  await pool.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
