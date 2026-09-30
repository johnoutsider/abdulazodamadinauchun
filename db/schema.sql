CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER','RESEARCHER')),
  name TEXT NOT NULL,
  age_group TEXT,
  gender TEXT,
  status TEXT,
  native_lang TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS strategies (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_uz TEXT NOT NULL,
  name_en TEXT NOT NULL,
  desc_uz TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  parent_id INT REFERENCES strategies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS factors (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  label_uz TEXT NOT NULL,
  label_en TEXT NOT NULL,
  UNIQUE (type, value)
);

CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  lang TEXT NOT NULL CHECK (lang IN ('en','uz')),
  equivalent TEXT NOT NULL DEFAULT '',
  strategy_id INT REFERENCES strategies(id) ON DELETE SET NULL,
  situation TEXT NOT NULL DEFAULT '',
  example TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS units_lang_idx ON units(lang);

CREATE TABLE IF NOT EXISTS unit_factors (
  unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  factor_id INT NOT NULL REFERENCES factors(id) ON DELETE CASCADE,
  PRIMARY KEY (unit_id, factor_id)
);

CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  guest_key TEXT,
  input_text TEXT NOT NULL,
  input_lang TEXT NOT NULL,
  situation TEXT NOT NULL DEFAULT '',
  input_factors JSONB NOT NULL DEFAULT '{}',
  strategy_code TEXT,
  factors JSONB NOT NULL DEFAULT '{}',
  explanation TEXT NOT NULL DEFAULT '',
  example TEXT NOT NULL DEFAULT '',
  suggestion TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL,
  matched_unit_id INT REFERENCES units(id) ON DELETE SET NULL,
  feedback SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analyses_created_idx ON analyses(created_at);

CREATE TABLE IF NOT EXISTS surveys (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS survey_questions (
  id SERIAL PRIMARY KEY,
  survey_id INT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  survey_id INT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  imported BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
