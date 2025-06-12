export interface ApiDocMeta {
  title: string;
  description: string;
  method: string;
  endpoint: string;
}

export interface PropertySchema {
  type: string;
  required?: boolean;
  description?: string;
  default?:
    | string
    | number
    | boolean
    | Record<string, unknown>
    | unknown[]
    | null;
  properties?: Record<string, PropertySchema>;
  example?: string;
}

export interface ApiDocHeader {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiDocRequest {
  type: string;
  properties: Record<string, PropertySchema>;
}

export interface ApiDocResponse {
  type: string;
  properties: Record<string, PropertySchema>;
}

export interface ApiDocExamples {
  request: Record<string, string>;
  response: {
    success: unknown;
  };
}

export interface ApiDocSchema {
  meta: ApiDocMeta;
  headers: ApiDocHeader[];
  request: ApiDocRequest;
  response: ApiDocResponse;
  examples: ApiDocExamples;
}
