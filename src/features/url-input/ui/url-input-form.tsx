'use client';

import { supabaseClient } from '@/shared/lib/supabase-client';
import { useState } from 'react';

export function UrlInputForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // URL 유효성 검사
      if (!url) {
        throw new Error('URL을 입력해주세요.');
      }

      try {
        new URL(url);
      } catch {
        throw new Error('유효한 URL을 입력해주세요.');
      }

      // 크롤링 요청 추가
      const { error: insertError } = await supabaseClient
        .from('crawl_jobs')
        .insert([
          {
            url,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      setSuccess('크롤링이 요청되었습니다. 잠시 후 문서가 업데이트됩니다.');
      setUrl('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg border border-gray-200'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='url'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            API 문서 URL
          </label>
          <div className='flex gap-4'>
            <input
              type='url'
              id='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='https://platform.openai.com/docs/api-reference/...'
              className='flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
              disabled={isLoading}
            />
            <button
              type='submit'
              disabled={isLoading}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? '처리 중...' : '문서 수집 요청'}
            </button>
          </div>
        </div>

        {error && (
          <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
            {error}
          </div>
        )}

        {success && (
          <div className='text-sm text-green-600 bg-green-50 p-3 rounded-md'>
            {success}
          </div>
        )}
      </form>
    </div>
  );
}
