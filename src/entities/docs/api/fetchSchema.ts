import { supabase } from '@/shared/lib/supabase';
import {
  ApiDocSchema,
  APIDocument,
  HttpMethod,
  ProviderInfo,
} from '@/shared/types/api-doc';

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
  // 새로 추가된 필드들
  slug: string[];
  path: string;
  parent_id: string | null;
}

// slug 배열 기반으로 path 생성하는 헬퍼 함수
export function slugArrayToPath(slugArray: string[]): string {
  if (!slugArray || slugArray.length === 0) return '/';
  return '/' + slugArray.join('/');
}

// path에서 slug 배열 추출하는 헬퍼 함수
export function pathToSlugArray(path: string): string[] {
  if (!path || path === '/') return [];
  return path.split('/').filter((segment) => segment.length > 0);
}

// 동적 provider 정보 생성 함수
function createProviderInfo(providerName: string): ProviderInfo {
  const normalizedName = providerName.toLowerCase().replace(/\s+/g, '');

  // 알려진 provider들의 정보
  const knownProviders: Record<string, Omit<ProviderInfo, 'id'>> = {
    openai: { name: 'OpenAI', category: 'llm', logo: '🟢', color: '#10a37f' },
    'google ai': {
      name: 'Google AI',
      category: 'llm',
      logo: '🔵',
      color: '#4285f4',
    },
    googleai: {
      name: 'Google AI',
      category: 'llm',
      logo: '🔵',
      color: '#4285f4',
    },
    anthropic: {
      name: 'Anthropic',
      category: 'llm',
      logo: '🟠',
      color: '#d97706',
    },
    'mistral ai': {
      name: 'Mistral AI',
      category: 'llm',
      logo: '🟣',
      color: '#7c3aed',
    },
    mistral: {
      name: 'Mistral AI',
      category: 'llm',
      logo: '🟣',
      color: '#7c3aed',
    },
    mistralai: {
      name: 'Mistral AI',
      category: 'llm',
      logo: '🟣',
      color: '#7c3aed',
    },
    cohere: { name: 'Cohere', category: 'llm', logo: '🟡', color: '#f59e0b' },
    github: { name: 'GitHub', category: 'rest', logo: '⚫', color: '#24292e' },
    stripe: { name: 'Stripe', category: 'rest', logo: '🔷', color: '#635bff' },
    notion: { name: 'Notion', category: 'rest', logo: '⚪', color: '#000000' },
    slack: { name: 'Slack', category: 'rest', logo: '🟪', color: '#4a154b' },
  };

  const providerInfo =
    knownProviders[normalizedName] ||
    knownProviders[providerName.toLowerCase()];

  return {
    id: providerName,
    name: providerInfo?.name || providerName,
    category: providerInfo?.category || 'other',
    logo: providerInfo?.logo || '⚪',
    color: providerInfo?.color || '#6b7280',
  };
}

/**
 * DB의 ApiDoc을 UI 컴포넌트용 APIDocument로 변환
 */
export function transformApiDocToAPIDocument(dbDoc: ApiDoc): APIDocument {
  // 동적 provider 정보 생성
  const provider = createProviderInfo(dbDoc.provider);

  // method를 HttpMethod enum으로 변환
  const methodMap: Record<string, HttpMethod> = {
    POST: HttpMethod.POST,
    GET: HttpMethod.GET,
    PUT: HttpMethod.PUT,
    DELETE: HttpMethod.DELETE,
  };

  const method = methodMap[dbDoc.method.toUpperCase()] || HttpMethod.POST;

  // schema 파싱
  let parsedSchema: ApiDocSchema | undefined;
  try {
    if (typeof dbDoc.schema === 'string') {
      parsedSchema = JSON.parse(dbDoc.schema);
    } else if (typeof dbDoc.schema === 'object' && dbDoc.schema !== null) {
      parsedSchema = dbDoc.schema as ApiDocSchema;
    }
  } catch (e) {
    console.error('Error parsing schema for doc:', dbDoc.id, e);
  }

  return {
    id: dbDoc.id,
    provider,
    modelName: dbDoc.model,
    serviceName: dbDoc.title,
    endpoint: dbDoc.endpoint,
    method,
    summary: dbDoc.title,
    description: dbDoc.description,
    tags: dbDoc.tags || [],
    codeExamples: [],
    lastUpdated: new Date(dbDoc.created_at).toISOString().split('T')[0],
    documentationLink: dbDoc.source_url || undefined,
    schema: parsedSchema,
  };
}

/**
 * DB에서 모든 활성화된 API 문서 목록 가져오기
 */
export async function fetchAllApiDocs(): Promise<APIDocument[]> {
  console.log('Fetching all API docs from database...');

  const { data, error } = await supabase
    .from('api_docs')
    .select('*')
    .eq('status', 'active')
    .order('provider', { ascending: true })
    .order('path', { ascending: true });

  if (error) {
    console.error('Error fetching API docs:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('No API docs found in database');
    return [];
  }

  console.log(`Found ${data.length} API documents in database`);

  // DB 문서를 UI 컴포넌트용 형태로 변환
  return data.map(transformApiDocToAPIDocument);
}

// slug 기반 fetch 함수
export async function fetchApiDocBySlug(
  provider: string,
  slugArray: string[]
): Promise<ApiDoc | null> {
  const path = slugArrayToPath(slugArray);
  console.log('Fetching API doc for:', { provider, slugArray, path });

  const { data, error } = await supabase
    .from('api_docs')
    .select('*')
    .eq('provider', provider.toLowerCase())
    .eq('path', path)
    .maybeSingle();

  if (error) {
    console.error('Error fetching API doc:', error);
    return null;
  }

  if (!data) {
    console.log('No API doc found for:', { provider, path });
    return null;
  }

  console.log('Found API document:', data);
  return data as ApiDoc;
}
