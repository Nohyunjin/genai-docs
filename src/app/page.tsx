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
}

export default async function Home() {
  const { data: docs } = await supabase
    .from('api_docs')
    .select('provider, model, schema')
    .order('provider', { ascending: true });

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold text-gray-900 mb-8'>
        생성형 AI API 문서
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {docs?.map((doc: ApiDoc) => (
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
            </div>

            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              {doc.schema.schema.meta.title}
            </h2>

            <p className='text-gray-600 text-sm line-clamp-2'>
              {doc.schema.schema.meta.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
