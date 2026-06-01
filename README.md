# SafeRoute

PWA for safe navigation with crowdsourced danger zones, emergency SOS, and route safety scores.

## Setup

1. Clone the repo and run `npm install`.
2. Copy `.env.example` to `.env` and fill in your Supabase credentials.
3. Run `npm run dev` for development, `npm run build` to create production build.
4. Set up Supabase tables using the schema below.

## Supabase Schema

```sql
-- Enable pgcrypto for uuid generation if needed
create extension if not exists "pgcrypto";

-- Danger zones table
create table danger_zones (
  id uuid default gen_random_uuid() primary key,
  user_id text, -- or reference auth.users
  latitude double precision not null,
  longitude double precision not null,
  type text check (type in ('assault', 'theft', 'harassment', 'poor_lighting', 'other')),
  description text,
  rating int default 0,
  confirm_count int default 0,
  created_at timestamptz default now()
);

-- Zone comments / forum
create table zone_comments (
  id uuid default gen_random_uuid() primary key,
  zone_id uuid references danger_zones(id) on delete cascade,
  user_id text,
  comment text,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Trusted contacts
create table trusted_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  name text not null,
  phone text,
  email text,
  priority int default 0
);

-- SOS alerts log
create table sos_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  latitude double precision,
  longitude double precision,
  timestamp timestamptz default now(),
  status text default 'active'
);

