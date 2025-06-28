'use client';

import { APIDocument } from '@/00.shared/types/api-doc';
import { ApiDocCard } from '@/02.features/api-doc-list';
import React from 'react';

interface ApiDocListProps {
  apiDocs: APIDocument[];
  loading?: boolean;
  error?: string | null;
}

export const ApiDocList: React.FC<ApiDocListProps> = ({
  apiDocs,
  loading = false,
  error = null,
}) => {
  // 로딩 상태
  if (loading) {
    return (
      <div className='text-center py-12'>
        <p className='text-xl text-neutral-400'>API 문서를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-xl text-red-400'>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-md transition-colors'
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 결과 표시
  if (apiDocs.length > 0) {
    return (
      <div className='grid grid-cols-1 gap-6 max-w-3xl mx-auto'>
        <p className='text-center text-neutral-400 mb-4'>
          {apiDocs.length}개의 API 문서 표시
        </p>
        {apiDocs.map((doc) => (
          <ApiDocCard key={doc.id} apiDoc={doc} />
        ))}
      </div>
    );
  }

  // 빈 상태
  return (
    <div className='text-center py-12'>
      <p className='text-2xl text-neutral-500'>검색 결과가 없습니다.</p>
      <p className='text-neutral-600 mt-2'>다른 키워드로 검색해보세요.</p>
    </div>
  );
};
