-- 1. Create table
CREATE TABLE wins (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Enable Row-Level Security (RLS)
ALTER TABLE wins ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous reads
CREATE POLICY "Public wins are viewable by everyone" 
ON wins FOR SELECT 
USING (true);

-- 4. Allow anonymous inserts
CREATE POLICY "Anyone can post a win" 
ON wins FOR INSERT 
WITH CHECK (true);
