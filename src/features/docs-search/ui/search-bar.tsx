'use client';

import { supabaseClient } from '@/shared/lib/supabase-client';
import { Link, Search, Send } from 'lucide-react';
import React, { useState } from 'react';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  hasResults?: boolean;
  searchTerm?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  placeholder = 'Search...',
  hasResults = true,
  searchTerm: externalSearchTerm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [crawlUrl, setCrawlUrl] = useState('');
  const [showCrawlForm, setShowCrawlForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCrawlRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlUrl.trim()) return;

    setIsSubmitting(true);
    setCrawlMessage(null);

    try {
      // URL 유효성 검사
      new URL(crawlUrl);

      // 크롤링 요청 추가
      const { error } = await supabaseClient.from('crawl_jobs').insert([
        {
          source_url: crawlUrl,
          status: 'pending',
          requested_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setCrawlMessage({
        type: 'success',
        text: "Thank you so much for sharing! We'll review and add this documentation as soon as possible.",
      });
      setCrawlUrl('');
      setShowCrawlForm(false);
    } catch (err) {
      setCrawlMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Sorry, something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowCrawlOption =
    !hasResults && (searchTerm || externalSearchTerm);

  return (
    <div className='space-y-4'>
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

      {shouldShowCrawlOption && (
        <div className='bg-neutral-800 border border-neutral-700 rounded-lg p-4'>
          <div className='flex items-start gap-3'>
            <Link className='h-5 w-5 text-fuchsia-400 mt-0.5' />
            <div className='flex-1'>
              <h3 className='text-sm font-medium text-neutral-200 mb-1'>
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className='text-xs text-neutral-400 mb-3'>
                If you know of API documentation that would be helpful to
                include, we&apos;d greatly appreciate if you could share the URL
                with us
              </p>

              {!showCrawlForm ? (
                <button
                  onClick={() => setShowCrawlForm(true)}
                  className='text-xs px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-md transition-colors'
                >
                  Help us improve by sharing a URL
                </button>
              ) : (
                <form onSubmit={handleCrawlRequest} className='space-y-3'>
                  <div className='flex gap-2'>
                    <input
                      type='url'
                      value={crawlUrl}
                      onChange={(e) => setCrawlUrl(e.target.value)}
                      placeholder='https://docs.example.com/api-reference (Thank you for helping!)'
                      className='flex-1 px-3 py-2 text-xs border border-neutral-600 rounded-md bg-neutral-900 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500'
                      disabled={isSubmitting}
                    />
                    <button
                      type='submit'
                      disabled={isSubmitting || !crawlUrl.trim()}
                      className='inline-flex items-center gap-1 px-3 py-2 text-xs bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-neutral-600 text-white rounded-md transition-colors disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? (
                        <>
                          <div className='w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin' />
                          Submitting
                        </>
                      ) : (
                        <>
                          <Send className='w-3 h-3' />
                          Share
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    type='button'
                    onClick={() => {
                      setShowCrawlForm(false);
                      setCrawlUrl('');
                      setCrawlMessage(null);
                    }}
                    className='text-xs text-neutral-400 hover:text-neutral-300'
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>

          {crawlMessage && (
            <div
              className={`mt-3 p-2 rounded-md text-xs ${
                crawlMessage.type === 'success'
                  ? 'bg-green-900/50 text-green-200 border border-green-700'
                  : 'bg-red-900/50 text-red-200 border border-red-700'
              }`}
            >
              {crawlMessage.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
