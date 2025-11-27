CREATE TABLE readinglists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  blog_id INTEGER REFERENCES blogs(id),
  read BOOLEAN DEFAULT false
);
