'use client';

import { ApiDocSchema, PropertySchema } from '@/entities/docs/model/types';
import { CodeBlock, CodeLanguage } from '@/shared/ui/code-block';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ApiDocProps {
  schema: ApiDocSchema;
}

interface Properties {
  [key: string]: PropertySchema;
}

export function ApiDoc({ schema }: ApiDocProps) {
  const [expandedProps, setExpandedProps] = useState<string[]>([]);

  const toggleProp = (propName: string) => {
    setExpandedProps((prev) =>
      prev.includes(propName)
        ? prev.filter((p) => p !== propName)
        : [...prev, propName]
    );
  };

  const isStreamResponse = (response: unknown): boolean => {
    return typeof response === 'string' && response.trim().startsWith('data:');
  };

  const renderProperties = (properties: Properties, parentKey: string = '') => {
    return Object.entries(properties).map(
      ([name, prop]: [string, PropertySchema]) => {
        const fullKey = parentKey ? `${parentKey}.${name}` : name;
        const hasNestedProps =
          prop.properties && Object.keys(prop.properties).length > 0;
        const isExpanded = expandedProps.includes(fullKey);

        return (
          <div key={fullKey} className='border-b pb-4'>
            <div className='flex items-center gap-3 mb-2'>
              <span className='font-mono text-sm text-gray-900'>{name}</span>
              <span className='text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600'>
                {prop.type}
              </span>
              {prop.required && (
                <span className='text-xs text-red-600'>Required</span>
              )}
            </div>

            <p className='text-gray-600 text-sm whitespace-pre-line mb-2'>
              {prop.description}
            </p>

            {prop.default && (
              <p className='mt-2 text-sm text-gray-500'>
                Defaults to{' '}
                <code className='text-xs bg-gray-100 px-1 py-0.5 rounded'>
                  {String(prop.default)}
                </code>
              </p>
            )}

            {hasNestedProps && (
              <button
                onClick={() => toggleProp(fullKey)}
                className='mt-2 flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700
              px-2 py-1 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors'
              >
                {isExpanded ? (
                  <ChevronDown className='w-4 h-4' />
                ) : (
                  <ChevronRight className='w-4 h-4' />
                )}
                <span>Show {isExpanded ? 'less' : 'more properties'}</span>
              </button>
            )}

            {hasNestedProps && isExpanded && (
              <div className='mt-4 pl-4 border-l border-gray-200 space-y-4'>
                {renderProperties(prop.properties || {}, fullKey)}
              </div>
            )}
          </div>
        );
      }
    );
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-semibold text-gray-900 mb-4'>
          {schema.meta.title}
        </h1>
        <div className='flex items-center gap-4 mb-6'>
          <span className='bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium'>
            {schema.meta.method}
          </span>
          <code className='font-mono text-gray-700 text-sm'>
            {schema.meta.endpoint}
          </code>
        </div>
        <p className='text-gray-600 text-lg whitespace-pre-line'>
          {schema.meta.description}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12'>
        <div className='space-y-12'>
          {/* Request Section */}
          <section>
            <h2 className='text-xl font-semibold mb-4'>Request</h2>
            <p className='text-gray-500 text-sm mb-6 border-b pb-4'>
              This endpoint expects an object.
            </p>
            <div className='space-y-6'>
              {renderProperties(schema.request.properties || {})}
            </div>
          </section>

          {/* Response Section */}
          <section>
            <h2 className='text-xl font-semibold mb-6'>Response</h2>
            <div className='space-y-6'>
              <div className='space-y-6'>
                {renderProperties(schema.response.properties || {})}
              </div>
            </div>
          </section>
        </div>

        {/* Right: Code Examples */}
        <div className='lg:sticky lg:top-4 space-y-6 w-full lg:max-w-[25vw]'>
          {/* Request Example */}
          <div className='bg-gray-50 rounded-lg p-4'>
            <CodeBlock
              examples={{
                method: schema.meta.method,
                endpoint: 'Request Example',
                examples: Object.entries(schema.examples.request).map(
                  ([lang, code]) => ({
                    language: lang as CodeLanguage,
                    label: lang.charAt(0).toUpperCase() + lang.slice(1),
                    code: String(code),
                  })
                ),
              }}
            />
          </div>

          {/* Response Example */}
          <div className='bg-gray-50 rounded-lg p-4'>
            <CodeBlock
              examples={{
                method: schema.meta.method,
                endpoint: 'Response Example',
                examples: [
                  {
                    language: isStreamResponse(schema.examples.response.success)
                      ? 'stream'
                      : 'javascript',
                    label: isStreamResponse(schema.examples.response.success)
                      ? 'Stream'
                      : 'JSON',
                    code: isStreamResponse(schema.examples.response.success)
                      ? String(schema.examples.response.success)
                      : JSON.stringify(
                          schema.examples.response.success,
                          null,
                          2
                        ),
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
