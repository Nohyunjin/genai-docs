// DB에서 가져온 raw API 문서 타입
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
  schema: unknown;
  source_url: string;
  status: string;
  created_at: string;
  updated_at: string | null;
  slug: string[];
  path: string;
  parent_id: string | null;
}
