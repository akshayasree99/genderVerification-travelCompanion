import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpzslrizdqbljhibclol.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwenNscml6ZHFibGpoaWJjbG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDQyNDMsImV4cCI6MjA2MDcyMDI0M30.S5GwxnQZdWHaXg58TfxXkLwafApTb8JY-m1MYZfX8OYY';

// Create a single supabase client for the entire app
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;