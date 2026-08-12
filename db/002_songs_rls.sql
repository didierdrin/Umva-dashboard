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
  using ((select auth.uid()) = user_id);

drop policy if exists songs_owner_insert on public.songs;
create policy songs_owner_insert
  on public.songs for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists songs_owner_update on public.songs;
create policy songs_owner_update
  on public.songs for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists songs_owner_delete on public.songs;
create policy songs_owner_delete
  on public.songs for delete to authenticated
  using ((select auth.uid()) = user_id);

-- NOTE: auth.uid() returns uuid and songs.user_id is uuid, so these compare
-- directly with no cast - which keeps songs_user_id_idx usable. Neon also exposes
-- auth.user_id() returning text; using it here would force a cast on the column
-- and disable that index.
