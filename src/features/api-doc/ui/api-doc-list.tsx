'use client';

import { API_DOCS } from '@/shared/constants/api-docs';
import { APIDocument } from '@/shared/types/api-doc';
import React, { useCallback, useMemo, useState } from 'react';
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

// SearchBar component
const SearchBar: React.FC<{ onSearchChange: (searchTerm: string) => void }> = ({
  onSearchChange,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onSearchChange(event.target.value);
  };

  return (
    <div className='relative'>
      <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
        <SearchIcon className='h-5 w-5 text-neutral-400' />
      </div>
      <input
        type='text'
        value={inputValue}
        onChange={handleChange}
        placeholder='Search by provider, model, endpoint, or keyword...'
        className='w-full pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-colors duration-200'
      />
    </div>
  );
};

interface ApiDocListProps {
  onDocSelect?: (doc: APIDocument) => void;
}

export const ApiDocList: React.FC<ApiDocListProps> = ({ onDocSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm.toLowerCase());
  }, []);

  const filteredApiDocs = useMemo(() => {
    if (!searchTerm) {
      return API_DOCS;
    }
    return API_DOCS.filter(
      (doc) =>
        doc.provider.toLowerCase().includes(searchTerm) ||
        doc.modelName.toLowerCase().includes(searchTerm) ||
        doc.serviceName.toLowerCase().includes(searchTerm) ||
        doc.endpoint.toLowerCase().includes(searchTerm) ||
        doc.summary.toLowerCase().includes(searchTerm) ||
        doc.description.toLowerCase().includes(searchTerm) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }, [searchTerm]);

  const handleViewDetails = useCallback(
    (docId: string) => {
      const doc = API_DOCS.find((d) => d.id === docId);
      if (doc && onDocSelect) {
        onDocSelect(doc);
      }
    },
    [onDocSelect]
  );

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
          {filteredApiDocs.map((doc) => (
            <ApiDocCard
              key={doc.id}
              apiDoc={doc}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-2xl text-neutral-500'>
            No APIs found matching your search.
          </p>
          <p className='text-neutral-600 mt-2'>
            Try a different keyword or check your spelling.
          </p>
        </div>
      )}
    </>
  );
};
