import { type ApiDoc } from '@/00.shared/lib';
import { APIDocument } from '@/00.shared/types/api-doc';
import {
  fetchAllApiDocs,
  fetchApiDocBySlug,
} from '@/01.entities/docs/api/fetchSchema';
import { cache } from 'react';
import {
  transformApiDocToAPIDocument,
  transformApiDocsToAPIDocuments,
} from '../lib/transformers';

// React cache를 사용한 중복 호출 제거 (raw data)
export const getCachedRawApiDoc = cache(
  async (provider: string, slug: string[]): Promise<ApiDoc | null> => {
    return fetchApiDocBySlug(provider, slug);
  }
);

export const getCachedRawAllApiDocs = cache(async (): Promise<ApiDoc[]> => {
  return fetchAllApiDocs();
});

// 변환된 데이터를 반환하는 캐시된 함수들
export const getCachedApiDoc = cache(
  async (provider: string, slug: string[]): Promise<APIDocument | null> => {
    const rawDoc = await fetchApiDocBySlug(provider, slug);
    return rawDoc ? transformApiDocToAPIDocument(rawDoc) : null;
  }
);

export const getCachedAllApiDocs = cache(async (): Promise<APIDocument[]> => {
  const rawDocs = await fetchAllApiDocs();
  return transformApiDocsToAPIDocuments(rawDocs);
});
