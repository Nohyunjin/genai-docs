'use client';

import {
  APIDocument,
  HttpMethod,
  ProviderInfo,
} from '@/00.shared/types/api-doc';
import Link from 'next/link';

// API 문서 URL 생성 헬퍼 함수
function generateApiDocUrl(apiDoc: APIDocument): string {
  const provider = apiDoc.provider.id.toLowerCase().replace(/\s/g, '');

  // URL-safe 형태로 변환 (점은 유지, 공백은 하이픈으로)
  const cleanProvider = provider.replace(/[^a-z0-9]/g, '');
  const cleanModel = apiDoc.modelName
    .toLowerCase()
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
    .replace(/[^a-z0-9\.\-]/g, '');

  return `/docs/${cleanProvider}/models/${cleanModel}`;
}

interface ApiDocCardProps {
  apiDoc: APIDocument;
}

function ProviderLogo({ provider }: { provider: ProviderInfo }) {
  // provider.logo가 있으면 사용, 없으면 기본 로직
  if (provider.logo) {
    return <span className='inline-block w-4 h-4 mr-1'>{provider.logo}</span>;
  }

  // 기존 로직 (provider.name 기반)
  const providerName = provider.name || provider.id || '';
  const lowerName = providerName.toLowerCase();

  if (lowerName.includes('google')) {
    return <span className='inline-block w-4 h-4 mr-1 text-blue-400'>🔵</span>;
  } else if (lowerName.includes('openai')) {
    return <span className='inline-block w-4 h-4 mr-1 text-green-400'>🟢</span>;
  } else if (lowerName.includes('anthropic')) {
    return (
      <span className='inline-block w-4 h-4 mr-1 text-orange-400'>🟠</span>
    );
  } else if (lowerName.includes('mistral')) {
    return (
      <span className='inline-block w-4 h-4 mr-1 text-indigo-400'>🟣</span>
    );
  } else if (lowerName.includes('cohere')) {
    return (
      <span className='inline-block w-4 h-4 mr-1 text-yellow-400'>🟡</span>
    );
  } else {
    return <span className='inline-block w-4 h-4 mr-1'>⚪</span>;
  }
}

function MethodBadge({
  method,
  small = false,
}: {
  method: HttpMethod;
  small?: boolean;
}) {
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

  const sizeClasses = small ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span className={`${colorClasses} ${sizeClasses} font-semibold rounded-md`}>
      {method}
    </span>
  );
}

export function ApiDocCard({ apiDoc }: ApiDocCardProps) {
  const cardBaseClasses =
    'bg-neutral-800 rounded-lg transition-all duration-300 ease-in-out border border-neutral-700 hover:border-fuchsia-500 shadow-md hover:shadow-fuchsia-500/20';

  // URL 네비게이션을 위한 Link 컴포넌트
  const DetailButton = (
    <Link
      href={generateApiDocUrl(apiDoc)}
      className='inline-block px-4 py-2 text-xs font-semibold bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-opacity-50'
      aria-label={`View details for ${apiDoc.modelName}`}
    >
      View Details
    </Link>
  );

  return (
    <div className={cardBaseClasses}>
      <div className='p-5'>
        <div className='flex justify-between items-start mb-3'>
          <div>
            <div className='flex items-center text-sm text-fuchsia-400 mb-1 font-medium'>
              <ProviderLogo provider={apiDoc.provider} />
              {apiDoc.provider.name}
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
}
