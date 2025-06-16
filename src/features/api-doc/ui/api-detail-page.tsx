'use client';

import {
  APIDocument,
  APIProvider,
  HttpMethod,
  PropertySchema,
} from '@/shared/types/api-doc';
import { CodeBlock } from '@/shared/ui/code-block';
import React, { useCallback, useEffect, useState } from 'react';

// Icons
const ChevronDownIcon: React.FC<{ className?: string }> = ({
  className = '',
}) => (
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
      d='M19 9l-7 7-7-7'
    />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({
  className = '',
}) => (
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
      d='M9 5l7 7-7 7'
    />
  </svg>
);

const ExternalLinkIcon: React.FC<{ className?: string }> = ({
  className = '',
}) => (
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
      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
    />
  </svg>
);

interface ApiDetailPageProps {
  apiDoc: APIDocument;
  onBack?: () => void;
}

const DetailMethodBadge: React.FC<{ method: HttpMethod }> = ({ method }) => {
  let colorClasses = 'bg-neutral-700 text-neutral-200';
  switch (method) {
    case HttpMethod.GET:
      colorClasses = 'bg-cyan-600 text-cyan-50';
      break;
    case HttpMethod.POST:
      colorClasses = 'bg-fuchsia-600 text-fuchsia-50';
      break;
    case HttpMethod.PUT:
      colorClasses = 'bg-pink-600 text-pink-50';
      break;
    case HttpMethod.DELETE:
      colorClasses = 'bg-rose-600 text-rose-50';
      break;
  }
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${colorClasses}`}
    >
      {method}
    </span>
  );
};

const ProviderBadge: React.FC<{ provider: APIProvider }> = ({ provider }) => {
  let colorClasses = 'bg-neutral-700 text-neutral-200';
  switch (provider) {
    case APIProvider.GOOGLE:
      colorClasses = 'bg-sky-600 text-sky-50';
      break;
    case APIProvider.OPENAI:
      colorClasses = 'bg-teal-600 text-teal-50';
      break;
    case APIProvider.ANTHROPIC:
      colorClasses = 'bg-orange-600 text-orange-50';
      break;
    case APIProvider.MISTRAL:
      colorClasses = 'bg-indigo-600 text-indigo-50';
      break;
    default:
      colorClasses = 'bg-slate-600 text-slate-50';
  }
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${colorClasses}`}
    >
      {provider}
    </span>
  );
};

export const ApiDetailPage: React.FC<ApiDetailPageProps> = ({
  apiDoc,
  onBack,
}) => {
  const [expandedProps, setExpandedProps] = useState<string[]>([]);
  const schema = apiDoc.schema;

  const handleBackToList = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBackToList();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleBackToList]);

  const toggleProp = (propName: string) => {
    setExpandedProps((prev) =>
      prev.includes(propName)
        ? prev.filter((p) => p !== propName)
        : [...prev, propName]
    );
  };

  const renderProperties = (
    properties: { [key: string]: PropertySchema } | undefined,
    parentKey: string = '',
    section: 'request' | 'response'
  ) => {
    if (!properties || Object.keys(properties).length === 0) {
      return (
        <p className='text-sm text-neutral-500 italic'>
          No {section} parameters defined.
        </p>
      );
    }
    return Object.entries(properties).map(([name, prop]) => {
      const fullKey = parentKey ? `${parentKey}.${name}` : name;
      const hasNestedProps =
        (prop.properties && Object.keys(prop.properties).length > 0) ||
        (prop.items &&
          prop.items.properties &&
          Object.keys(prop.items.properties).length > 0);
      const isExpanded = expandedProps.includes(fullKey);
      const displayProperties =
        prop.type === 'array' && prop.items?.properties
          ? prop.items.properties
          : prop.properties;

      return (
        <div
          key={fullKey}
          className='py-3 border-b border-neutral-800 last:border-b-0'
        >
          <div className='flex items-baseline gap-2 mb-1'>
            <span className='font-mono text-sm text-fuchsia-300'>{name}</span>
            <span className='text-xs px-1.5 py-0.5 bg-neutral-700 rounded text-cyan-300 font-mono'>
              {prop.type}
              {prop.type === 'array' && prop.items
                ? ` of ${prop.items.type}`
                : ''}
            </span>
            {prop.required && (
              <span className='text-xs text-red-400 font-semibold'>
                Required
              </span>
            )}
          </div>
          <p className='text-neutral-400 text-sm whitespace-pre-line mb-1.5'>
            {prop.description}
          </p>
          {prop.default !== undefined && (
            <p className='mt-1 text-xs text-neutral-500'>
              Defaults to:{' '}
              <code className='text-xs bg-neutral-700 px-1 py-0.5 rounded text-neutral-300'>
                {String(prop.default)}
              </code>
            </p>
          )}
          {prop.enum && (
            <p className='mt-1 text-xs text-neutral-500'>
              Enum:{' '}
              {prop.enum.map((e) => (
                <code
                  key={e}
                  className='text-xs bg-neutral-700 px-1 py-0.5 rounded text-neutral-300 mr-1'
                >
                  {e}
                </code>
              ))}
            </p>
          )}
          {prop.example !== undefined && (
            <p className='mt-1 text-xs text-neutral-500'>
              Example:{' '}
              <code className='text-xs bg-neutral-700 px-1 py-0.5 rounded text-neutral-300'>
                {String(prop.example)}
              </code>
            </p>
          )}

          {hasNestedProps && (
            <button
              onClick={() => toggleProp(fullKey)}
              className='mt-2 flex items-center gap-1 text-xs text-fuchsia-400 hover:text-fuchsia-300
                         px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors'
            >
              {isExpanded ? (
                <ChevronDownIcon className='w-3 h-3' />
              ) : (
                <ChevronRightIcon className='w-3 h-3' />
              )}
              <span>{isExpanded ? 'Hide' : 'Show'} nested properties</span>
            </button>
          )}

          {hasNestedProps && isExpanded && displayProperties && (
            <div className='mt-3 ml-2 pl-3 border-l-2 border-neutral-700 space-y-2'>
              {renderProperties(displayProperties, fullKey, section)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!schema) {
    return (
      <div className='max-w-none mx-auto py-2'>
        <button
          onClick={handleBackToList}
          className='mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-fuchsia-500'
        >
          &larr; Back to API List
        </button>
        <div className='text-center py-12'>
          <p className='text-2xl text-neutral-500'>
            Detailed documentation not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-none mx-auto py-2'>
      <button
        onClick={handleBackToList}
        className='mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-fuchsia-500'
      >
        &larr; Back to API List
      </button>

      <div className='mb-10 pb-6 border-b border-neutral-800'>
        <h1 className='text-3xl lg:text-4xl font-bold text-neutral-50 mb-3'>
          {schema.meta.title}
        </h1>
        <div className='flex flex-wrap items-center gap-3 mb-4'>
          <DetailMethodBadge method={schema.meta.method} />
          <code className='font-mono text-neutral-400 text-sm bg-neutral-800 px-2 py-1 rounded'>
            {schema.meta.endpoint}
          </code>
          <ProviderBadge provider={apiDoc.provider} />
        </div>
        <p className='text-neutral-300 text-base leading-relaxed whitespace-pre-line'>
          {schema.meta.description}
        </p>
        {apiDoc.tags && apiDoc.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-4'>
            {apiDoc.tags.map((tag) => (
              <span
                key={tag}
                className='bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-full text-xs'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {apiDoc.documentationLink && (
          <a
            href={apiDoc.documentationLink}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-4 inline-flex items-center text-sm text-fuchsia-400 hover:text-fuchsia-300'
          >
            Official Documentation{' '}
            <ExternalLinkIcon className='w-4 h-4 ml-1.5' />
          </a>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-x-12 gap-y-10'>
        <div className='space-y-10'>
          {schema.headers && schema.headers.length > 0 && (
            <section>
              <h2 className='text-xl font-semibold text-neutral-100 mb-3'>
                Headers
              </h2>
              <div className='space-y-1 bg-neutral-800/50 p-4 rounded-md'>
                {schema.headers.map((header, index) => (
                  <div
                    key={index}
                    className='py-3 border-b border-neutral-700 last:border-b-0'
                  >
                    <div className='flex items-baseline gap-2 mb-1'>
                      <span className='font-mono text-sm text-fuchsia-300'>
                        {header.name}
                      </span>
                      <span className='text-xs px-1.5 py-0.5 bg-neutral-700 rounded text-cyan-300 font-mono'>
                        {header.type}
                      </span>
                      {header.required && (
                        <span className='text-xs text-red-400 font-semibold'>
                          Required
                        </span>
                      )}
                    </div>
                    <p className='text-neutral-400 text-sm'>
                      {header.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {schema.request && (
            <section>
              <h2 className='text-xl font-semibold text-neutral-100 mb-3'>
                Request Body
              </h2>
              <div className='bg-neutral-800/50 p-4 rounded-md space-y-3'>
                {renderProperties(schema.request.properties, '', 'request')}
              </div>
            </section>
          )}

          {schema.response?.success?.schema?.properties && (
            <section>
              <h2 className='text-xl font-semibold text-neutral-100 mb-3'>
                Response Body
              </h2>
              <div className='bg-neutral-800/50 p-4 rounded-md space-y-3'>
                {renderProperties(
                  schema.response.success.schema.properties,
                  '',
                  'response'
                )}
              </div>
            </section>
          )}
        </div>

        <div className='space-y-6'>
          <section>
            <h2 className='text-xl font-semibold text-neutral-100 mb-3'>
              Code Examples
            </h2>
            {schema.examples && schema.examples.request.length > 0 && (
              <div className='space-y-4'>
                {schema.examples.request.map((example, index) => (
                  <div key={index}>
                    <h3 className='text-sm font-medium text-neutral-300 mb-2'>
                      {example.label}
                    </h3>
                    <CodeBlock
                      code={example.code}
                      language={example.language}
                    />
                  </div>
                ))}
              </div>
            )}
            {(!schema.examples || schema.examples.request.length === 0) &&
              apiDoc.codeExamples.length > 0 && (
                <div className='space-y-4'>
                  {apiDoc.codeExamples.map((example, index) => (
                    <div key={index}>
                      <h3 className='text-sm font-medium text-neutral-300 mb-2'>
                        {example.label}
                      </h3>
                      <CodeBlock
                        code={example.code}
                        language={example.language}
                      />
                    </div>
                  ))}
                </div>
              )}
          </section>

          {schema.examples && schema.examples.response.length > 0 && (
            <section>
              <h2 className='text-xl font-semibold text-neutral-100 mb-3'>
                Example Response
              </h2>
              <div className='space-y-4'>
                {schema.examples.response.map((example, index) => (
                  <div key={index}>
                    <h3 className='text-sm font-medium text-neutral-300 mb-2'>
                      {example.label}
                    </h3>
                    <CodeBlock
                      code={example.code}
                      language={example.language}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
