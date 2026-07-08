import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fdguajjczjhfpriblhog.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3VhampjempoZnByaWJsaG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzAwNzgsImV4cCI6MjA5NjM0NjA3OH0.2E7WbQ-N83tTxVHDJV65ocec2GIdHLS8QGysKJnFtqY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
