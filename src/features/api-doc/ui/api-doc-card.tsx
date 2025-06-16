'use client';

import { APIDocument, APIProvider, HttpMethod } from '@/shared/types/api-doc';
import React from 'react';

interface ApiDocCardProps {
  apiDoc: APIDocument;
  onViewDetails?: (docId: string) => void;
}

const ProviderLogo: React.FC<{ provider: APIProvider; className?: string }> = ({
  provider,
  className = 'w-5 h-5',
}) => {
  const baseClasses = `mr-1.5 ${className} font-semibold text-fuchsia-400`;
  switch (provider) {
    case APIProvider.GOOGLE:
      return (
        <span className={baseClasses} title='Google AI'>
          G
        </span>
      );
    case APIProvider.OPENAI:
      return (
        <span className={baseClasses} title='OpenAI'>
          O
        </span>
      );
    case APIProvider.ANTHROPIC:
      return (
        <span className={baseClasses} title='Anthropic'>
          A
        </span>
      );
    case APIProvider.COHERE:
      return (
        <span className={baseClasses} title='Cohere'>
          C
        </span>
      );
    case APIProvider.MISTRAL:
      return (
        <span className={baseClasses} title='Mistral AI'>
          M
        </span>
      );
    default:
      return null;
  }
};

const MethodBadge: React.FC<{ method: HttpMethod; small?: boolean }> = ({
  method,
  small = false,
}) => {
  let colorClasses = 'bg-neutral-600 text-neutral-100';
  switch (method) {
    case HttpMethod.GET:
      colorClasses = 'bg-cyan-700 text-cyan-50';
      break;
    case HttpMethod.POST:
      colorClasses = 'bg-fuchsia-700 text-fuchsia-50';
      break;
    case HttpMethod.PUT:
      colorClasses = 'bg-pink-700 text-pink-50';
      break;
    case HttpMethod.DELETE:
      colorClasses = 'bg-rose-700 text-rose-50';
      break;
  }
  const sizeClass = small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`${sizeClass} font-semibold rounded-full ${colorClasses}`}>
      {method}
    </span>
  );
};

export const ApiDocCard: React.FC<ApiDocCardProps> = ({
  apiDoc,
  onViewDetails,
}) => {
  const cardBaseClasses =
    'bg-neutral-800 rounded-lg transition-all duration-300 ease-in-out border border-neutral-700 hover:border-fuchsia-500 shadow-md hover:shadow-fuchsia-500/20';

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    if (onViewDetails) {
      e.preventDefault();
      onViewDetails(apiDoc.id);
    }
  };

  const DetailButton = (
    <button
      onClick={onViewDetails ? handleViewDetailsClick : undefined}
      className='px-4 py-2 text-xs font-semibold bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-opacity-50'
      aria-label={`View details for ${apiDoc.modelName}`}
    >
      View Details
    </button>
  );

  return (
    <div className={cardBaseClasses}>
      <div className='p-5'>
        <div className='flex justify-between items-start mb-3'>
          <div>
            <div className='flex items-center text-sm text-fuchsia-400 mb-1 font-medium'>
              <ProviderLogo provider={apiDoc.provider} />
              {apiDoc.provider}
            </div>
            <h3 className='text-xl font-semibold text-neutral-50'>
              {apiDoc.modelName}
            </h3>
            <p className='text-xs text-neutral-400'>{apiDoc.serviceName}</p>
          </div>
        </div>

        <div className='mb-3 flex items-center space-x-2'>
          <MethodBadge method={apiDoc.method} small />
          <p
            className='text-sm text-neutral-500 truncate'
            title={apiDoc.endpoint}
          >
            {apiDoc.endpoint}
          </p>
        </div>

        <p
          className='text-sm text-neutral-300 mb-4 leading-relaxed line-clamp-2'
          title={apiDoc.summary}
        >
          {apiDoc.summary}
        </p>

        <div className='flex flex-wrap gap-1.5 mb-4'>
          {apiDoc.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className='px-2 py-0.5 text-xs bg-neutral-700 text-neutral-300 rounded-full'
            >
              {tag}
            </span>
          ))}
          {apiDoc.tags.length > 3 && (
            <span className='px-2 py-0.5 text-xs bg-neutral-700 text-neutral-300 rounded-full'>
              +{apiDoc.tags.length - 3} more
            </span>
          )}
        </div>

        <div className='flex justify-between items-center mt-4'>
          <p className='text-xs text-neutral-500'>
            Updated: {apiDoc.lastUpdated}
          </p>
          {DetailButton}
        </div>
      </div>
    </div>
  );
};
