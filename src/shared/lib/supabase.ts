import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 환경변수 검증 함수
function validateEnvVars() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'SUPABASE_URL is required. Please check your environment variables.'
    );
  }

  if (!supabaseKey) {
    throw new Error(
      'SUPABASE_ANON_KEY is required. Please check your environment variables.'
    );
  }

  return { supabaseUrl, supabaseKey };
}

// 서버 사이드 Supabase 클라이언트 (싱글톤)
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const { supabaseUrl, supabaseKey } = validateEnvVars();
    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
}

// 기본 export (하위 호환성)
export const supabase = getSupabase();
