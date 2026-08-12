// src/lib/authClient.js
//
// Thin wrapper over the Neon Auth (Better Auth) REST API.
//
// Deliberately plain fetch rather than @neondatabase/neon-js: this app is on
// react-scripts@5, which is unmaintained and chokes on ESM-only packages, and
// the SDK pulls ~230 transitive deps to wrap four endpoints. Every path below
// was verified live against the deployed auth server.
//
// Sessions are cookie-based, so every call needs credentials: 'include'. For
// that to work from the deployed dashboard, the Vercel origin must be listed in
// Neon Auth -> Configuration -> Trusted origins. Localhost is allowed already.

const AUTH_URL = process.env.REACT_APP_NEON_AUTH_URL;

if (!AUTH_URL) {
  // CRA inlines env vars at build time, so a missing var is a build-time
  // mistake that otherwise surfaces as a confusing "undefined/sign-in" 404.
  console.error('REACT_APP_NEON_AUTH_URL is not set. Auth calls will fail.');
}

async function call(path, { method = 'POST', body } = {}) {
  let res;
  try {
    res = await fetch(`${AUTH_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // fetch only rejects on network-level failure - DNS, CORS preflight, offline.
    throw new Error('Cannot reach the authentication server. Check your connection.');
  }

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function signUp({ name, email, password }) {
  return call('/sign-up/email', { body: { name, email, password } });
}

export function signIn({ email, password }) {
  return call('/sign-in/email', { body: { email, password } });
}

export function signOut() {
  return call('/sign-out', { body: {} });
}

export async function getSession() {
  try {
    return await call('/get-session', { method: 'GET' });
  } catch {
    // Signed out is the normal case here, not an error worth surfacing.
    return null;
  }
}

/**
 * JWT for the Data API. Returns null when signed out, which callers use to fall
 * back to unauthenticated (anonymous-role) requests.
 */
export async function getToken() {
  try {
    const data = await call('/token', { method: 'GET' });
    return data?.token ?? null;
  } catch {
    return null;
  }
}
