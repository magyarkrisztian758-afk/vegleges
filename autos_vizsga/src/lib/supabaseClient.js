import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL és ANON KEY szükségesek. Ellenőrizd a .env.local fájlt!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
