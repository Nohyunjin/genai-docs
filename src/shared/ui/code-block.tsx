'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

export type CodeLanguage = 'javascript' | 'python' | 'curl' | 'stream' | 'text';

interface CodeExample {
  language: CodeLanguage;
  label: string;
  code: string;
}

interface CodeBlockProps {
  examples: {
    method: string;
    endpoint: string;
    examples: CodeExample[];
  };
}

export function CodeBlock({ examples }: CodeBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const selectedExample = examples.examples[selectedIndex];

  const copyToClipboard = async () => {
    if (!selectedExample?.code) return;
    await navigator.clipboard.writeText(selectedExample.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!selectedExample) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <h3 className='text-sm font-medium text-gray-900'>
          {examples.endpoint}
        </h3>
      </div>

      {examples.examples.length > 1 && (
        <div className='flex gap-2'>
          {examples.examples.map((example, index) => (
            <button
              key={example.label}
              onClick={() => setSelectedIndex(index)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                index === selectedIndex
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {example.label}
            </button>
          ))}
        </div>
      )}

      <div className='relative group rounded-lg overflow-hidden border border-zinc-200'>
        <div className='flex items-center justify-between px-4 py-2 bg-zinc-100'>
          <span className='text-sm text-zinc-600 capitalize'>
            {selectedExample.language}
          </span>
          <button
            onClick={copyToClipboard}
            className='flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 transition-colors'
            aria-label='Copy code'
          >
            {isCopied ? (
              <>
                <Check className='h-4 w-4' />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className='h-4 w-4' />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className='relative'>
          <SyntaxHighlighter
            language={selectedExample.language}
            style={prism}
            showLineNumbers
            customStyle={{
              margin: 0,
              background: '#fafafa',
              fontSize: '14px',
            }}
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1em',
              color: '#666',
              userSelect: 'none',
            }}
            codeTagProps={{
              style: {
                fontSize: 'inherit',
                lineHeight: '1.5',
              },
            }}
          >
            {selectedExample.code || ''}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
