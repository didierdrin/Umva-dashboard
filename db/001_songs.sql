-- 001_songs.sql
-- Application schema for Umva, replacing the deleted Supabase project.
-- Column set is derived from what the dashboard and the Flutter app actually
-- read/write:
--   dashboard: Library.jsx (insert/update/select), Dashboard.jsx, Payout.jsx
--   mobile:    lib/services/supabase_service.dart (searchSongs)

create table if not exists public.songs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null,
  title         text not null,
  artist        text not null,
  file_url      text not null,
  image_url     text not null default '',
  subscription  boolean not null default false,
  total_plays   integer not null default 0,
  unique_plays  integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Library.jsx and Dashboard.jsx both filter on user_id; Payout.jsx aggregates
-- unique_plays per user. This index covers all three.
create index if not exists songs_user_id_idx on public.songs (user_id);

-- The mobile app searches title/artist with ILIKE '%term%'. A btree index can't
-- serve a leading-wildcard match, so use trigram indexes instead.
create extension if not exists pg_trgm;
create index if not exists songs_title_trgm_idx  on public.songs using gin (title  gin_trgm_ops);
create index if not exists songs_artist_trgm_idx on public.songs using gin (artist gin_trgm_ops);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists songs_set_updated_at on public.songs;
create trigger songs_set_updated_at
  before update on public.songs
  for each row execute function public.set_updated_at();
