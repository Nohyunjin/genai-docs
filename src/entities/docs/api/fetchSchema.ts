import { supabase } from '@/shared/lib/supabase';
import { ApiDocSchema } from '../model/types';

export interface ApiDoc {
  id: string;
  provider: string;
  model: string;
  schema: ApiDocSchema;
  updated_at: string;
  source_url: string;
}

export async function fetchSchema(
  provider: string,
  model: string
): Promise<ApiDocSchema | null> {
  console.log('Fetching schema for:', { provider, model });

  // 전체 데이터 조회
  const { data: allDocs } = await supabase
    .from('api_docs')
    .select('provider, model');

  console.log('All available docs:', allDocs);

  // 실제 쿼리 실행 전에 파라미터 출력
  const normalizedProvider = provider.toLowerCase();
  const normalizedModel = model.toLowerCase();

  console.log('Searching with params:', {
    normalizedProvider,
    normalizedModel,
  });

  const { data, error } = await supabase
    .from('api_docs')
    .select('*')
    .eq('provider', normalizedProvider)
    .eq('model', normalizedModel)
    .maybeSingle();

  if (error) {
    console.error('Error fetching schema:', error);
    return null;
  }

  if (!data) {
    console.log('No schema found for:', {
      normalizedProvider,
      normalizedModel,
    });
    return null;
  }

  // schema 구조를 자세히 로깅
  console.log('Found document schema:', JSON.stringify(data.schema, null, 2));

  // schema가 문자열이면 파싱
  if (typeof data.schema === 'string') {
    try {
      return JSON.parse(data.schema);
    } catch (e) {
      console.error('Error parsing schema:', e);
      return null;
    }
  }

  // data.schema.schema가 실제 스키마 데이터
  return data.schema.schema;
}
