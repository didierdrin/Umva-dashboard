// src/lib/dataApi.js
//
// Minimal PostgREST client for the Neon Data API, replacing supabase-js.
//
// Access is enforced server-side by RLS (see db/002_songs_rls.sql), not here:
//   anonymous    -> SELECT on songs
//   authenticated -> full CRUD, restricted to rows where auth.uid() = user_id
// So a missing token degrades to public read rather than failing outright.

import { getToken } from './authClient';

const DATA_API_URL = process.env.REACT_APP_NEON_DATA_API_URL;

if (!DATA_API_URL) {
  console.error('REACT_APP_NEON_DATA_API_URL is not set. Data calls will fail.');
}

async function request(path, { method = 'GET', body, prefer } = {}) {
  const token = await getToken();

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (prefer) headers.Prefer = prefer;

  let res;
  try {
    res = await fetch(`${DATA_API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the database. Check your connection.');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export function listSongsByUser(userId) {
  return request(`/songs?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`);
}

export function insertSong(song) {
  return request('/songs', {
    method: 'POST',
    body: song,
    prefer: 'return=representation',
  });
}

export function updateSong(id, patch) {
  return request(`/songs?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: patch,
    prefer: 'return=representation',
  });
}

export function deleteSong(id) {
  return request(`/songs?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
}
