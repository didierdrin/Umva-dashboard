-- 002_songs_rls.sql
--
-- RUN THIS ONLY AFTER ENABLING THE NEON DATA API.
-- Enabling the Data API is what creates the `authenticated` and `anonymous`
-- roles and the auth.user_id() helper. Running this beforehand fails with
--: role "authenticated" does not exist
--
-- The Data API exposes these tables over public HTTP, so RLS is the ONLY thing
-- standing between the internet and this table. Do not skip it.

alter table public.songs enable row level security;

-- Listeners: the mobile app browses and searches the catalogue without logging
-- in (lib/services/supabase_service.dart has no auth), so anonymous needs read.
grant usage on schema public to anonymous, authenticated;
grant select on public.songs to anonymous;

-- Artists: the dashboard manages only its own rows.
grant select, insert, update, delete on public.songs to authenticated;

drop policy if exists songs_anon_read on public.songs;
create policy songs_anon_read
  on public.songs for select to anonymous
  using (true);

drop policy if exists songs_owner_read on public.songs;
create policy songs_owner_read
  on public.songs for select to authenticated
  using ((select auth.user_id()) = user_id::text);

drop policy if exists songs_owner_insert on public.songs;
create policy songs_owner_insert
  on public.songs for insert to authenticated
  with check ((select auth.user_id()) = user_id::text);

drop policy if exists songs_owner_update on public.songs;
create policy songs_owner_update
  on public.songs for update to authenticated
  using ((select auth.user_id()) = user_id::text)
  with check ((select auth.user_id()) = user_id::text);

drop policy if exists songs_owner_delete on public.songs;
create policy songs_owner_delete
  on public.songs for delete to authenticated
  using ((select auth.user_id()) = user_id::text);

-- NOTE ON THE CAST: neon_auth."user".id is uuid, while auth.user_id() returns
-- the JWT `sub` claim as text. If your Neon version returns uuid instead, drop
-- the ::text on user_id in the five policies above, or the comparison silently
-- matches nothing and every query comes back empty.
