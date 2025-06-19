import {
  fetchAllApiDocs,
  fetchApiDocBySlug,
  type ApiDoc,
} from '@/entities/docs/api/fetchSchema';
import { cache } from 'react';

// React cache를 사용한 중복 호출 제거
export const getCachedApiDoc = cache(
  async (provider: string, slug: string[]): Promise<ApiDoc | null> => {
    return fetchApiDocBySlug(provider, slug);
  }
);

export const getCachedAllApiDocs = cache(async () => {
  return fetchAllApiDocs();
});
