'use client';

import { Search } from 'lucide-react';
import React, { useState } from 'react';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  placeholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className='relative'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <Search className='h-5 w-5 text-neutral-400' />
      </div>
      <input
        type='text'
        className='block w-full pl-10 pr-3 py-3 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent sm:text-sm'
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};
