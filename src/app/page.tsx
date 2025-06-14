import { UrlInputForm } from '@/features/url-input/ui/url-input-form';
import { supabase } from '@/shared/lib/supabase';
import Link from 'next/link';

interface ApiDoc {
  provider: string;
  model: string;
  schema: {
    schema: {
      meta: {
        title: string;
        description: string;
      };
    };
  };
  updated_at: string;
}

export default async function Home() {
  const { data: docs } = await supabase
    .from('api_docs')
    .select('provider, model, schema, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          생성형 AI API 문서
        </h1>
        <p className='text-lg text-gray-600'>
          API 문서 URL을 입력하여 자동으로 문서를 수집하고 관리하세요.
        </p>
      </div>

      {/* URL 입력 폼 */}
      <div className='mb-12'>
        <UrlInputForm />
      </div>

      {/* 문서 리스트 */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold text-gray-900'>
          수집된 API 문서
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {docs?.map((doc: ApiDoc) => {
            const isNew =
              new Date(doc.updated_at).getTime() >
              Date.now() - 7 * 24 * 60 * 60 * 1000; // 7일 이내

            return (
              <Link
                key={`${doc.provider}-${doc.model}`}
                href={`/docs/${doc.provider}/${doc.model}`}
                className='block p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-400 transition-colors'
              >
                <div className='flex items-center gap-3 mb-4'>
                  <span className='px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium'>
                    {doc.provider}
                  </span>
                  <span className='text-sm text-gray-600'>{doc.model}</span>
                  {isNew && (
                    <span className='px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                      NEW
                    </span>
                  )}
                </div>

                <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                  {doc.schema.schema.meta.title}
                </h2>

                <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
                  {doc.schema.schema.meta.description}
                </p>

                <div className='text-xs text-gray-500'>
                  마지막 업데이트:{' '}
                  {new Date(doc.updated_at).toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
