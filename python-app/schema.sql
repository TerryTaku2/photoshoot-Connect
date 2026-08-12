PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS studios (
  id TEXT PRIMARY KEY,
  owner_id TEXT UNIQUE NOT NULL REFERENCES users(id),
  slug TEXT UNIQUE NOT NULL,
  brand_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  instagram TEXT NOT NULL DEFAULT '',
  primary_color TEXT NOT NULL DEFAULT '#1b1917',
  accent_color TEXT NOT NULL DEFAULT '#9c7a4f',
  canvas_color TEXT NOT NULL DEFAULT '#faf8f5',
  plan TEXT NOT NULL DEFAULT 'starter',
  layout TEXT NOT NULL DEFAULT 'classic',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  studio_id TEXT NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'gallery',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  studio_id TEXT NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  event_date TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
