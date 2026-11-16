import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export function sanitizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim();
  if (!cleaned) return '';

  // Handle Postgres connection string if pasted accidentally
  if (cleaned.startsWith('postgresql://') || cleaned.startsWith('postgres://')) {
    const match = cleaned.match(/postgres(?:ql)?:\/\/(?:postgres\.([a-z0-9_-]+)|[a-z0-9_-]+):[^@]+@/i);
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`;
    }
  }

  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }

  // Strip /rest/v1, /auth/v1, /storage/v1 or any extra path on *.supabase.co
  try {
    const parsed = new URL(cleaned);
    if (parsed.hostname.endsWith('.supabase.co') || parsed.hostname.endsWith('.supabase.in')) {
      return `${parsed.protocol}//${parsed.host}`;
    }
    // Strip known Supabase API subpaths on custom domains too
    const strippedPath = parsed.pathname.replace(/\/(rest|auth|storage|realtime|functions)\/v1.*$/i, '').replace(/\/+$/, '');
    return `${parsed.protocol}//${parsed.host}${strippedPath}`;
  } catch {
    return cleaned
      .replace(/\/(rest|auth|storage|realtime|functions)\/v1.*$/i, '')
      .replace(/\/+$/, '');
  }
}

export function sanitizeSupabaseKey(rawKey?: string): string {
  if (!rawKey) return '';
  return rawKey.trim();
}

export function getSupabase(url?: string, anonKey?: string): SupabaseClient | null {
  const targetUrl = sanitizeSupabaseUrl(
    url ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
      ''
  );
  const targetKey = sanitizeSupabaseKey(
    anonKey ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
      ''
  );

  if (!targetUrl || !targetKey) {
    return null;
  }

  if (!supabaseClient || cachedUrl !== targetUrl || cachedKey !== targetKey) {
    try {
      supabaseClient = createClient(targetUrl, targetKey);
      cachedUrl = targetUrl;
      cachedKey = targetKey;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseClient;
}

export function resetSupabaseClient(url: string, anonKey: string): SupabaseClient | null {
  const cleanUrl = sanitizeSupabaseUrl(url);
  const cleanKey = sanitizeSupabaseKey(anonKey);

  if (!cleanUrl || !cleanKey) {
    supabaseClient = null;
    cachedUrl = '';
    cachedKey = '';
    return null;
  }
  try {
    supabaseClient = createClient(cleanUrl, cleanKey);
    cachedUrl = cleanUrl;
    cachedKey = cleanKey;
    return supabaseClient;
  } catch (err) {
    console.error('Failed to reset Supabase client:', err);
    supabaseClient = null;
    cachedUrl = '';
    cachedKey = '';
    return null;
  }
}
