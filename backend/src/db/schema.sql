--Reolve-AI Support agent schema(PostgreSQL + pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS support_cases(
  id  SERIAL PRIMARY KEY,
  tweet_id  TEXT UNIQUE NOT NULL,
  customer_text TEXT NOT NULL,
  brand_reply   TEXT NOT NULL,
  thread        JSONB NOT NULL,
  intent        TEXT,
  created_at    TIMESTAMPTZ,
  embedding     vector(768) NOT NULL
);

--approximate nearest neighbour index for cosine distance (<=>)
CREATE INDEX IF NOT EXISTS support_cases_embedding_idx
  ON support_cases USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS support_cases_intent_idx ON support_cases (intent);

--// Every decision the agent make is stored,so escalation can be reviewed later.
CREATE TABLE IF NOT EXISTS agent_runs(
  id            SERIAL PRIMARY KEY,
  message       TEXT NOT NULL,
  intent        TEXT,
  action        TEXT,
  reason        TEXT,
  draft_reply   TEXT,
  result        JSONB,
  created_at    TIMESTAMPTZ DEFAULT now()
);