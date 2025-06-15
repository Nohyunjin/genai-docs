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
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <div className='p-6 sm:p-8'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-purple-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              API 문서 URL 입력
            </h3>
            <p className='text-sm text-gray-500'>
              수집하고 싶은 API 문서의 URL을 입력해주세요.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <div className='flex gap-4'>
              <input
                type='url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='https://platform.openai.com/docs/api-reference/...'
                className='flex-1 min-w-0 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                disabled={isLoading}
              />
              <button
                type='submit'
                disabled={isLoading}
                className='inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    처리 중...
                  </>
                ) : (
                  '문서 수집 요청'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className='text-sm text-red-600 bg-red-50 p-4 rounded-lg flex items-start gap-3'>
              <svg
                className='w-5 h-5 text-red-500 mt-0.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className='text-sm text-green-600 bg-green-50 p-4 rounded-lg flex items-start gap-3'>
              <svg
                className='w-5 h-5 text-green-500 mt-0.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
