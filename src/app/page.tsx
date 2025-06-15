import { UrlInputForm } from '@/features/url-input/ui/url-input-form';
import { supabase } from '@/shared/lib/supabase';
import Link from 'next/link';

export default async function Home() {
  const { data: docs } = await supabase
    .from('api_docs')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-b from-purple-50 to-white'>
        <div className='max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6'>
              생성형 AI API 문서
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              API 문서 URL을 입력하여 자동으로 문서를 수집하고 관리하세요.
              <br />
              모든 생성형 AI API 문서를 한 곳에서 확인하고 관리할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        {/* URL Input Form */}
        <div className='max-w-3xl mx-auto mb-16'>
          <UrlInputForm />
        </div>

        {/* Docs List */}
        <div className='space-y-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold text-gray-900'>
              수집된 API 문서
            </h2>
            <span className='text-sm text-gray-500'>
              총 {docs?.length || 0}개의 문서
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {docs?.map((doc) => {
              const isNew =
                new Date().getTime() - new Date(doc.updated_at).getTime() <
                7 * 24 * 60 * 60 * 1000;

              return (
                <Link
                  key={`${doc.provider}-${doc.model}`}
                  href={`/docs/${doc.provider}/${doc.model}`}
                  className='group block bg-white rounded-lg border border-gray-200 hover:border-purple-400 transition-all duration-200 hover:shadow-lg'
                >
                  <div className='p-6'>
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

                    <h2 className='text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors'>
                      {doc.schema.schema.meta.title}
                    </h2>

                    <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
                      {doc.schema.schema.meta.description}
                    </p>

                    <div className='flex items-center justify-between text-xs text-gray-500'>
                      <span>
                        마지막 업데이트:{' '}
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </span>
                      <span className='text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                        자세히 보기 →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
