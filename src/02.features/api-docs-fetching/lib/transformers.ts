import { type ApiDoc } from '@/00.shared/lib';
import {
  ApiDocSchema,
  APIDocument,
  HttpMethod,
} from '@/00.shared/types/api-doc';
import { createProviderInfo } from '@/02.features/api-doc-list/lib/provider-info';

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
 * 여러 API 문서를 변환
 */
export function transformApiDocsToAPIDocuments(
  dbDocs: ApiDoc[]
): APIDocument[] {
  return dbDocs.map(transformApiDocToAPIDocument);
}
