import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpzslrizdqbljhibclol.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwenNscml6ZHFibGpoaWJjbG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDQyNDMsImV4cCI6MjA2MDcyMDI0M30.S5GwxnQZdWHaXg58TfxXkLwafApTb8JY-m1MYZfX8OY';
export const supabase = createClient(supabaseUrl, supabaseKey);
