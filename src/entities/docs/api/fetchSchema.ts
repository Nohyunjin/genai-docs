import { supabase } from '@/shared/lib/supabase';
import { ApiDocSchema } from '../model/types';

export interface ApiDoc {
  id: string;
  provider: string;
  model: string;
  title: string;
  description: string;
  endpoint: string;
  method: string;
  tags: string[];
  keywords: string[];
  schema: unknown; // JSON 문자열 또는 객체
  source_url: string;
  status: string;
  created_at: string;
  updated_at: string | null;
}

export async function fetchApiDoc(
  provider: string,
  model: string
): Promise<ApiDoc | null> {
  console.log('Fetching API doc for:', { provider, model });

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
    console.error('Error fetching API doc:', error);
    return null;
  }

  if (!data) {
    console.log('No API doc found for:', {
      normalizedProvider,
      normalizedModel,
    });
    return null;
  }

  console.log('Found API document:', data);

  return data as ApiDoc;
}

// 하위 호환성을 위한 기존 함수 (스키마만 반환)
export async function fetchSchema(
  provider: string,
  model: string
): Promise<ApiDocSchema | null> {
  const apiDoc = await fetchApiDoc(provider, model);

  if (!apiDoc) {
    return null;
  }

  // schema 파싱
  try {
    if (typeof apiDoc.schema === 'string') {
      return JSON.parse(apiDoc.schema);
    }

    if (typeof apiDoc.schema === 'object' && apiDoc.schema !== null) {
      const schemaObj = apiDoc.schema as Record<string, unknown>;
      // schema.schema 구조인 경우
      if (schemaObj.schema) {
        return schemaObj.schema as ApiDocSchema;
      }
      // 직접 스키마인 경우
      return apiDoc.schema as ApiDocSchema;
    }

    return null;
  } catch (e) {
    console.error('Error parsing schema:', e);
    return null;
  }
}
