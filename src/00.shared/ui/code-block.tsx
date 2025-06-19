'use client';

import { cn } from '@/00.shared/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      <div className='flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-sm'>
        <span className='font-mono'>{language || 'Code'}</span>
        <button
          onClick={handleCopy}
          className='flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-700 transition-colors'
          title='코드 복사'
        >
          {copied ? (
            <>
              <Check size={14} />
              <span className='text-xs'>복사됨!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className='text-xs'>복사</span>
            </>
          )}
        </button>
      </div>
      <pre className='bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto'>
        <code className='font-mono text-sm'>{code}</code>
      </pre>
    </div>
  );
}
