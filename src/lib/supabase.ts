import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or API Key is missing. Check your environment variables.");
}

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'dummy-key'
);