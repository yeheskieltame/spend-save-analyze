
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vhmkkbwxhdhwctwspklq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobWtrYnd4aGRod2N0d3Nwa2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTAyODksImV4cCI6MjA1ODI2NjI4OX0.yzygXlj4kivuw50P3su3T7f-wfO4BectqqLJ9OAeNC4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false, // This prevents auto-login after closing the tab
    storageKey: 'financetracker-auth-session', // Custom storage key for the session
  }
});
