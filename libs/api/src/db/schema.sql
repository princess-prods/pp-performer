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

-- Act frequencies lookup table
CREATE TABLE IF NOT EXISTS act_frequencies (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

INSERT INTO act_frequencies (id, name, description) VALUES
  (1, 'Very High', 'Appears in most mainstream productions'),
  (2, 'High', 'Regularly featured in commercial content'),
  (3, 'Medium-High', 'Common but not ubiquitous'),
  (4, 'Medium', 'Standard category, regularly produced'),
  (5, 'Low-Medium', 'Niche but with consistent audience'),
  (6, 'Low', 'Specialty/fetish content'),
  (7, 'Very Low', 'Rare/extreme niche')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Act categories lookup table
CREATE TABLE IF NOT EXISTS act_categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO act_categories (id, name) VALUES
  (1, 'Mainstream'),
  (2, 'Standard'),
  (3, 'BDSM'),
  (4, 'Fetish'),
  (5, 'Extreme'),
  (6, 'Style')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Acts lookup table
CREATE TABLE IF NOT EXISTS acts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  frequency_id INTEGER NOT NULL REFERENCES act_frequencies(id),
  category_id INTEGER NOT NULL REFERENCES act_categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed acts
INSERT INTO acts (name, frequency_id, category_id) VALUES
  -- Mainstream
  ('Solo masturbation', 1, 1),
  ('Blowjob', 1, 1),
  ('Cunnilingus', 1, 1),
  ('Vaginal sex', 1, 1),
  ('Handjob', 1, 1),
  ('Anal sex', 2, 1),
  ('Lesbian', 2, 1),
  ('Threesome (MFF)', 2, 1),
  ('Threesome (MMF)', 2, 1),
  ('POV', 2, 1),
  ('Creampie', 2, 1),
  ('Facial', 2, 1),
  ('Deep throat', 2, 1),
  -- Standard
  ('Double penetration', 3, 2),
  ('Gangbang', 4, 2),
  ('Orgy', 4, 2),
  ('MILF', 4, 2),
  ('Teen (18+)', 4, 2),
  ('Interracial', 4, 2),
  ('Squirting', 4, 2),
  ('Rimming', 4, 2),
  ('Titjob', 4, 2),
  ('Footjob', 4, 2),
  ('Cum swallow', 4, 2),
  -- BDSM
  ('Bondage', 4, 3),
  ('Domination', 4, 3),
  ('Submission', 4, 3),
  ('Spanking', 4, 3),
  ('Choking', 4, 3),
  ('Role play', 4, 3),
  ('Discipline', 5, 3),
  ('Rope bondage', 5, 3),
  ('Electro play', 6, 3),
  ('Wax play', 6, 3),
  ('CBT', 6, 3),
  ('Pegging', 5, 3),
  ('Strap-on', 4, 3),
  ('Femdom', 5, 3),
  ('Cuckold', 5, 3),
  ('Chastity', 6, 3),
  -- Fetish
  ('Foot worship', 4, 4),
  ('Stockings', 4, 4),
  ('Latex', 5, 4),
  ('Leather', 5, 4),
  ('High heels', 4, 4),
  ('Balloon', 7, 4),
  ('Food play', 6, 4),
  ('Oil', 4, 4),
  ('Cosplay', 5, 4),
  ('Uniform', 4, 4),
  -- Extreme
  ('Vaginal fisting', 6, 5),
  ('Anal fisting', 6, 5),
  ('Gaping', 5, 5),
  ('Double anal', 6, 5),
  ('Double vaginal', 6, 5),
  ('Triple penetration', 7, 5),
  ('High heel insertion', 7, 5),
  ('Object insertion', 6, 5),
  ('Prolapse', 7, 5),
  ('Watersports', 6, 5),
  ('Spitting', 6, 5),
  ('Face sitting', 4, 5),
  ('Smothering', 6, 5),
  ('Breath play', 6, 5),
  ('Wrestling', 6, 5),
  ('Catfight', 6, 5),
  ('Tickling', 6, 5),
  ('Trampling', 7, 5),
  ('Crushing', 7, 5),
  -- Style
  ('Amateur', 2, 6),
  ('Professional', 2, 6),
  ('Gonzo', 4, 6),
  ('Glamcore', 4, 6),
  ('VR', 5, 6),
  ('Behind the scenes', 6, 6)
ON CONFLICT (name) DO UPDATE SET frequency_id = EXCLUDED.frequency_id, category_id = EXCLUDED.category_id;

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
