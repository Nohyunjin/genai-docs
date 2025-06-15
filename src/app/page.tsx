import { UrlInputForm } from '@/features/url-input/ui/url-input-form';
import { supabase } from '@/shared/lib/supabase';
import Link from 'next/link';

export default async function Home() {
  console.log('홈페이지 로딩 시작...');

  const { data: docs, error } = await supabase
    .from('api_docs')
    .select('*')
    .order('updated_at', { ascending: false });

  console.log('Supabase 쿼리 결과:', { docs, error });

  if (error) {
    console.error('Supabase 오류:', error);
  }

  // 스키마 파싱 헬퍼 함수
  const parseSchema = (schemaData: unknown) => {
    try {
      // 이미 객체인 경우
      if (typeof schemaData === 'object' && schemaData !== null) {
        const obj = schemaData as Record<string, unknown>;
        // schema.schema 구조인 경우
        if (
          obj.schema &&
          typeof obj.schema === 'object' &&
          obj.schema !== null
        ) {
          const nestedSchema = obj.schema as Record<string, unknown>;
          if (nestedSchema.meta) {
            return nestedSchema;
          }
        }
        // 직접 meta가 있는 경우
        if (obj.meta) {
          return obj;
        }
      }

      // 문자열인 경우 파싱
      if (typeof schemaData === 'string') {
        const parsed = JSON.parse(schemaData);
        return parsed.meta ? parsed : parsed.schema;
      }

      return null;
    } catch (e) {
      console.error('스키마 파싱 오류:', e, schemaData);
      return null;
    }
  };

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

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-red-600'>
                데이터를 불러오는 중 오류가 발생했습니다: {error.message}
              </p>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {docs?.map((doc) => {
              const schema = parseSchema(doc.schema);
              const isNew =
                doc.updated_at &&
                new Date().getTime() - new Date(doc.updated_at).getTime() <
                  7 * 24 * 60 * 60 * 1000;

              return (
                <Link
                  key={doc.id}
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
                      {schema?.meta?.title || doc.title || '제목 없음'}
                    </h2>

                    <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
                      {schema?.meta?.description ||
                        doc.description ||
                        '설명 없음'}
                    </p>

                    <div className='flex items-center justify-between text-xs text-gray-500'>
                      <span>
                        마지막 업데이트:{' '}
                        {doc.updated_at
                          ? new Date(doc.updated_at).toLocaleDateString()
                          : '알 수 없음'}
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

          {docs && docs.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500'>아직 수집된 문서가 없습니다.</p>
              <p className='text-sm text-gray-400 mt-2'>
                위의 입력 폼을 사용하여 API 문서를 추가해보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
