-- Create extension for UUID if needed (on Supabase it's already present)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text,
  instruction text,
  summary_md text,
  transcript_text text,
  llm_model text
);

CREATE TABLE IF NOT EXISTS shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_id uuid REFERENCES summaries(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  recipients jsonb,
  status text,
  provider_message_id text
);

ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Open policies for MVP (relax later!)
CREATE POLICY "public read write summaries" ON summaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public read write shares" ON shares FOR ALL USING (true) WITH CHECK (true);
