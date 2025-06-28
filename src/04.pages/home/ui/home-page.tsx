'use client';

import { APIDocument } from '@/00.shared/types/api-doc';
import { ApiDocList } from '@/03.widgets/api-doc-list';
import { SearchBar } from '@/03.widgets/search-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface HomePageProps {
  apiDocs: APIDocument[];
}

export const HomePage: React.FC<HomePageProps> = ({ apiDocs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // 검색 필터링 로직
  const filteredApiDocs = useMemo(() => {
    if (!searchTerm.trim()) {
      return apiDocs;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return apiDocs.filter((doc) => {
      const searchableText = [
        doc.provider.name,
        doc.modelName,
        doc.serviceName,
        doc.summary,
        doc.description,
        doc.endpoint,
        ...(doc.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(lowercaseSearchTerm);
    });
  }, [apiDocs, searchTerm]);

  // 로딩 상태 시뮬레이션 (실제로는 서버에서 처리)
  useEffect(() => {
    if (apiDocs.length === 0) {
      setLoading(true);
      // 실제 앱에서는 여기서 API 호출
      setTimeout(() => {
        setLoading(false);
        if (apiDocs.length === 0) {
          setError('Failed to load API documentation');
        }
      }, 1000);
    }
  }, [apiDocs.length]);

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
        <SearchBar
          onSearchChange={handleSearchChange}
          placeholder='Search APIs by provider, model, or description...'
          hasResults={filteredApiDocs.length > 0}
          searchTerm={searchTerm}
        />
      </div>

      <ApiDocList apiDocs={filteredApiDocs} loading={loading} error={error} />
    </>
  );
};
