'use client';

import { APIDocument } from '@/shared/types/api-doc';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiDocCard } from './api-doc-card';

// Search Icon
const SearchIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    />
  </svg>
);

// Search Bar Component
const SearchBar: React.FC<{
  onSearchChange: (searchTerm: string) => void;
}> = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className='relative'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <SearchIcon className='h-5 w-5 text-neutral-400' />
      </div>
      <input
        type='text'
        className='block w-full pl-10 pr-3 py-3 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent sm:text-sm'
        placeholder='Search APIs by provider, model, or description...'
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

interface ApiDocListProps {
  initialApiDocs?: APIDocument[];
}

export const ApiDocList: React.FC<ApiDocListProps> = ({
  initialApiDocs = [],
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(initialApiDocs.length === 0);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터가 없으면 에러 표시
  useEffect(() => {
    if (initialApiDocs.length === 0) {
      setError('초기 데이터를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
      setLoading(false);
    }
  }, [initialApiDocs.length]);

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm.toLowerCase());
  }, []);

  const filteredApiDocs = useMemo(() => {
    if (!searchTerm) {
      return initialApiDocs;
    }
    return initialApiDocs.filter(
      (doc) =>
        doc.provider.name.toLowerCase().includes(searchTerm) ||
        doc.modelName.toLowerCase().includes(searchTerm) ||
        doc.serviceName.toLowerCase().includes(searchTerm) ||
        doc.endpoint.toLowerCase().includes(searchTerm) ||
        doc.summary.toLowerCase().includes(searchTerm) ||
        doc.description.toLowerCase().includes(searchTerm) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }, [searchTerm, initialApiDocs]);

  // 로딩 상태
  if (loading) {
    return (
      <div className='max-w-3xl mx-auto'>
        <div className='max-w-3xl mx-auto mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400'>
            Explore GenAI APIs
          </h1>
          <p className='text-lg text-neutral-400 text-center mb-8'>
            Instantly find, understand, and use Generative AI APIs with
            ready-to-use code examples.
          </p>
        </div>
        <div className='text-center py-12'>
          <p className='text-xl text-neutral-400'>API 문서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className='max-w-3xl mx-auto'>
        <div className='max-w-3xl mx-auto mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400'>
            Explore GenAI APIs
          </h1>
          <p className='text-lg text-neutral-400 text-center mb-8'>
            Instantly find, understand, and use Generative AI APIs with
            ready-to-use code examples.
          </p>
        </div>
        <div className='text-center py-12'>
          <p className='text-xl text-red-400'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-md transition-colors'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='max-w-3xl mx-auto mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400'>
          Explore GenAI APIs
        </h1>
        <p className='text-lg text-neutral-400 text-center mb-8'>
          Instantly find, understand, and use Generative AI APIs with
          ready-to-use code examples.
        </p>
        <SearchBar onSearchChange={handleSearchChange} />
      </div>

      {filteredApiDocs.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 max-w-3xl mx-auto'>
          <p className='text-center text-neutral-400 mb-4'>
            {initialApiDocs.length}개의 API 문서 중 {filteredApiDocs.length}개
            표시
          </p>
          {filteredApiDocs.map((doc) => (
            <ApiDocCard key={doc.id} apiDoc={doc} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-2xl text-neutral-500'>
            {initialApiDocs.length === 0
              ? 'DB에 등록된 API 문서가 없습니다.'
              : 'No APIs found matching your search.'}
          </p>
          <p className='text-neutral-600 mt-2'>
            {initialApiDocs.length === 0
              ? '관리자에게 문의하세요.'
              : 'Try a different keyword or check your spelling.'}
          </p>
        </div>
      )}
    </>
  );
};
