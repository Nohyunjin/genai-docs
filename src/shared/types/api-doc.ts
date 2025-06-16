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

export interface PropertySchema {
  type: string;
  description: string;
  required?: boolean;
  default?: any;
  properties?: { [key: string]: PropertySchema };
  items?: PropertySchema;
  enum?: string[];
  example?: any;
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
  provider: APIProvider;
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
