import { type ApiDoc } from '@/00.shared/lib';
import { supabase } from '@/00.shared/lib/supabase';

/**
 * DB에서 모든 활성화된 API 문서 목록 가져오기 (raw data)
 */
export async function fetchAllApiDocs(): Promise<ApiDoc[]> {
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

  return data as ApiDoc[];
}

/**
 * provider와 slug로 특정 API 문서 가져오기 (raw data)
 */
export async function fetchApiDocBySlug(
  provider: string,
  slugArray: string[]
): Promise<ApiDoc | null> {
  const path = slugArray.length === 0 ? '/' : '/' + slugArray.join('/');
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
