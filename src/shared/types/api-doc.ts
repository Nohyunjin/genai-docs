// Provider 정보를 담는 인터페이스
export interface ProviderInfo {
  id: string; // DB의 provider 필드값 (예: 'openai', 'mistralai')
  name: string; // 표시용 이름 (예: 'OpenAI', 'Mistral AI')
  category: 'llm' | 'rest' | 'graphql' | 'other';
  logo?: string; // 로고 URL 또는 이모지
  color?: string; // 브랜드 컬러
}

// 기존 호환성을 위한 enum (deprecated)
export enum APIProvider {
  GOOGLE = 'Google AI',
  OPENAI = 'OpenAI',
  ANTHROPIC = 'Anthropic',
  COHERE = 'Cohere',
  MISTRAL = 'Mistral AI',
}

export enum CodeLanguage {
  CURL = 'cURL',
  JAVASCRIPT = 'JavaScript',
  PYTHON = 'Python',
  JSON = 'JSON',
  STREAM = 'Stream',
  TEXT = 'Text',
}

export interface CodeSnippet {
  language: CodeLanguage;
  code: string;
  label: string;
}

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// JSON 값 타입 정의
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export interface PropertySchema {
  type: string;
  description: string;
  required?: boolean;
  default?: JsonValue;
  properties?: { [key: string]: PropertySchema };
  items?: PropertySchema;
  enum?: string[];
  example?: JsonValue;
}

export interface HeaderSchema {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface ExampleCode {
  language: CodeLanguage;
  label: string;
  code: string;
}

export interface ApiDocSchema {
  meta: {
    title: string;
    method: HttpMethod;
    endpoint: string;
    description: string;
  };
  headers?: HeaderSchema[];
  request?: {
    description?: string;
    type: 'object';
    properties: { [key: string]: PropertySchema };
  };
  response?: {
    description?: string;
    success: {
      statusCode: string;
      description: string;
      schema: {
        type: 'object' | 'array' | 'string';
        properties?: { [key: string]: PropertySchema };
        items?: PropertySchema;
      };
    };
  };
  examples: {
    request: ExampleCode[];
    response: ExampleCode[];
  };
}

export interface APIDocument {
  id: string;
  provider: ProviderInfo; // 동적 provider 정보
  modelName: string;
  serviceName: string;
  endpoint: string;
  method: HttpMethod;
  summary: string;
  description: string;
  tags: string[];
  codeExamples: CodeSnippet[];
  lastUpdated: string;
  documentationLink?: string;
  schema?: ApiDocSchema;
}
