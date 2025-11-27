-- Luodaan users-taulu
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Lisätään userId-sarake blogs-tauluun
ALTER TABLE blogs ADD COLUMN "userId" INTEGER REFERENCES users(id);
