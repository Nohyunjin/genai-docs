import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

// 서버 사이드에서만 사용되는 클라이언트
export const supabase = createClient(supabaseUrl, supabaseKey);
