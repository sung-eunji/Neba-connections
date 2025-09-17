import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Diagnostics to help troubleshoot "Failed to fetch" issues in development
const isPlaceholderUrl =
  !import.meta.env.VITE_SUPABASE_URL || supabaseUrl.includes('placeholder');
const hasLikelyValidKey =
  !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
  String(import.meta.env.VITE_SUPABASE_ANON_KEY).length > 20;

export const supabaseDiagnostics = {
  url: supabaseUrl,
  hasKey: hasLikelyValidKey,
  isPlaceholder: isPlaceholderUrl,
};

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info('[Supabase] URL:', supabaseUrl);
  // eslint-disable-next-line no-console
  console.info('[Supabase] Key present:', hasLikelyValidKey);
  if (isPlaceholderUrl) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Supabase] Using placeholder URL. Set VITE_SUPABASE_URL and restart the dev server.'
    );
  }
}

// Export to window for manual inspection
// eslint-disable-next-line no-undef
window.supabase = supabase;
// eslint-disable-next-line no-undef
window.__SUPABASE_DIAG = supabaseDiagnostics;
