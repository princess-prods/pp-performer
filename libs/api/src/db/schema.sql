-- Genders lookup table
CREATE TABLE IF NOT EXISTS genders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Seed genders with explicit IDs
INSERT INTO genders (id, name) VALUES
  (1, 'Male'),
  (2, 'Female'),
  (3, 'Trans Male'),
  (4, 'Trans Female'),
  (5, 'Non-Binary')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Reset sequence to continue after our seeded IDs
SELECT setval('genders_id_seq', (SELECT MAX(id) FROM genders));

-- Acts lookup table
CREATE TABLE IF NOT EXISTS acts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performers table
CREATE TABLE IF NOT EXISTS performers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  age INT NOT NULL,
  is_verified_18 BOOLEAN NOT NULL DEFAULT FALSE,
  city TEXT NOT NULL,
  state_province TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  gender_id INT NOT NULL REFERENCES genders(id),
  social_links TEXT[] DEFAULT '{}',
  -- Physical attributes (nullable for now)
  eye_color_id INT,
  hair_color_id INT,
  build_type_id INT,
  bra_size TEXT,
  panty_size TEXT,
  shoe_size TEXT,
  dress_size TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction table for performers <-> acts
CREATE TABLE IF NOT EXISTS performer_acts (
  performer_id UUID NOT NULL REFERENCES performers(id) ON DELETE CASCADE,
  act_id UUID NOT NULL REFERENCES acts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (performer_id, act_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_performers_email ON performers(email);
CREATE INDEX IF NOT EXISTS idx_performers_external_id ON performers(external_id);
CREATE INDEX IF NOT EXISTS idx_performer_acts_performer_id ON performer_acts(performer_id);
CREATE INDEX IF NOT EXISTS idx_performer_acts_act_id ON performer_acts(act_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS performers_updated_at ON performers;
CREATE TRIGGER performers_updated_at
  BEFORE UPDATE ON performers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
