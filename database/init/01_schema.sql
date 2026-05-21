CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS badges (
  badge_key TEXT PRIMARY KEY,
  label_key TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS words (
  id TEXT PRIMARY KEY,
  locale TEXT NOT NULL REFERENCES languages(code) ON DELETE RESTRICT,
  slug TEXT NOT NULL,
  word TEXT NOT NULL,
  pronunciation TEXT NOT NULL,
  origin_hint TEXT NOT NULL,
  official_definition_id TEXT,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(locale, slug)
);

CREATE TABLE IF NOT EXISTS definitions (
  id TEXT PRIMARY KEY,
  word_id TEXT NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  base_votes INTEGER NOT NULL DEFAULT 0 CHECK (base_votes >= 0),
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'words_official_definition_fk'
  ) THEN
    ALTER TABLE words
      ADD CONSTRAINT words_official_definition_fk
      FOREIGN KEY (official_definition_id) REFERENCES definitions(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS definition_badges (
  definition_id TEXT NOT NULL REFERENCES definitions(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL REFERENCES badges(badge_key) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (definition_id, badge_key)
);

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id TEXT NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  definition_id TEXT NOT NULL REFERENCES definitions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS votes_one_anonymous_vote_per_word
  ON votes(word_id, anonymous_id)
  WHERE user_id IS NULL AND anonymous_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS votes_one_user_vote_per_word
  ON votes(word_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS definitions_word_id_idx ON definitions(word_id);
CREATE INDEX IF NOT EXISTS votes_word_id_idx ON votes(word_id);
CREATE INDEX IF NOT EXISTS votes_definition_id_idx ON votes(definition_id);
CREATE INDEX IF NOT EXISTS words_locale_published_idx ON words(locale, published_at DESC);
