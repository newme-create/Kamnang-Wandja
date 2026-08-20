import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../types/database';

export const SUPABASE_URL_STORAGE_KEY = 'batir_pro_supabase_url';
export const SUPABASE_ANON_KEY_STORAGE_KEY = 'batir_pro_supabase_anon_key';

/**
 * Resolves Supabase credentials from environment variables, Vite variables, or localStorage.
 */
export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  let url = '';
  let anonKey = '';

  // 1. Check Vite meta env
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  if (metaEnv) {
    url = (metaEnv.VITE_SUPABASE_URL as string) || (metaEnv.NEXT_PUBLIC_SUPABASE_URL as string) || '';
    anonKey = (metaEnv.VITE_SUPABASE_ANON_KEY as string) || (metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) || '';
  }

  // 2. Check process.env if available
  if (!url && typeof process !== 'undefined' && process.env) {
    url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  }

  // 3. Check browser localStorage override
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem(SUPABASE_URL_STORAGE_KEY);
    const localKey = localStorage.getItem(SUPABASE_ANON_KEY_STORAGE_KEY);
    if (localUrl && localUrl.trim() !== '') {
      url = localUrl.trim();
    }
    if (localKey && localKey.trim() !== '') {
      anonKey = localKey.trim();
    }
  }

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('placeholder') &&
    !anonKey.includes('placeholder') &&
    url.startsWith('https://')
  );

  return {
    url: url || 'https://placeholder-supabase-url.supabase.co',
    anonKey: anonKey || 'placeholder-anon-key',
    isConfigured,
  };
}

/**
 * Saves custom Supabase credentials to localStorage.
 */
export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_URL_STORAGE_KEY, url.trim());
    localStorage.setItem(SUPABASE_ANON_KEY_STORAGE_KEY, anonKey.trim());
  }
}

/**
 * Clears custom Supabase credentials from localStorage.
 */
export function clearSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SUPABASE_URL_STORAGE_KEY);
    localStorage.removeItem(SUPABASE_ANON_KEY_STORAGE_KEY);
  }
}

/**
 * Creates a Supabase client for use in Client Components and Browser contexts.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseCredentials();
  return createBrowserClient<Database>(url, anonKey);
}

/**
 * Tests connection to Supabase and verifies if the `quote_requests` table exists.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
  error?: string;
}> {
  const { isConfigured, url } = getSupabaseCredentials();
  if (!isConfigured) {
    return {
      connected: false,
      tableExists: false,
      message: 'Supabase URL ou Clé Anon non configurée.',
    };
  }

  try {
    const supabase = createClient();
    // Try querying 1 record
    const { data, error } = await supabase
      .from('quote_requests')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist') || error.message.includes('relation "quote_requests"')) {
        return {
          connected: true,
          tableExists: false,
          message: 'Connecté à Supabase, mais la table "quote_requests" n\'existe pas encore. Veuillez exécuter le script SQL fourni.',
          error: error.message,
        };
      }
      return {
        connected: false,
        tableExists: false,
        message: `Erreur Supabase (${error.code || 'ERR'}): ${error.message}`,
        error: error.message,
      };
    }

    return {
      connected: true,
      tableExists: true,
      message: `Connexion établie avec succès avec la base Supabase (${new URL(url).hostname}).`,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: `Impossible de contacter Supabase: ${err.message || err}`,
      error: String(err),
    };
  }
}
