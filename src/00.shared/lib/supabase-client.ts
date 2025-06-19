import { createClient } from '@supabase/supabase-js';

// 클라이언트 사이드 환경변수 검증
function validateClientEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is required. Please check your environment variables.'
    );
  }

  if (!supabaseKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is required. Please check your environment variables.'
    );
  }

  return { supabaseUrl, supabaseKey };
}

// 클라이언트 사이드에서 사용되는 Supabase 클라이언트
const { supabaseUrl, supabaseKey } = validateClientEnvVars();
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
