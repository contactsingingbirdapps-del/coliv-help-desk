import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration - using the correct project
const SUPABASE_URL = "https://qtglsxsscxqpividdfsj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2xzeHNzY3hxcGl2aWRkZnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjcwMDEsImV4cCI6MjA3MTI0MzAwMX0.n2ZfjXus-zZVFiIRVoMzFWPLF86jrsmIg0v3oYPo1AE";

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Safe storage check for SSR/Node environments
const getStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

// Create Supabase client with proper configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: getStorage(),
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'cohub-help-desk'
    }
  }
});

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    console.log('Database connection successful');
    return true;
  } catch (err) {
    console.error('Database connection test error:', err);
    return false;
  }
};

// Export for debugging
export const supabaseConfig = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 20)}...` : 'undefined'
};