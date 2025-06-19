import { transformApiDocToAPIDocument } from '@/01.entities/docs/api/fetchSchema';
import { getCachedApiDoc } from '@/02.features/api-docs-fetching';
import { ApiDetailPage } from '@/04.pages/api-detail';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    provider: string;
    slug: string[];
  }>;
};

export default function Page(props: Props) {
  return <DocPage {...props} />;
}

async function DocPage({ params }: Props) {
  const { provider, slug = [] } = await params;

  console.log('DocPage params:', { provider, slug });

  const apiDocData = await getCachedApiDoc(provider, slug);

  if (!apiDocData) {
    console.log('API doc not found, redirecting to not-found');
    notFound();
  }

  // DB 데이터를 APIDocument 형식으로 변환
  const apiDocument = transformApiDocToAPIDocument(apiDocData);

  // ApiDetailPage 컴포넌트 사용 (다크 테마 래퍼 포함)
  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-100'>
      <div className='container mx-auto px-4 py-8'>
        <ApiDetailPage apiDoc={apiDocument} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { provider, slug = [] } = await params;

  // slug 배열을 읽기 쉬운 형태로 변환
  const slugPath = slug.length > 0 ? slug.join(' / ') : 'Home';

  // API 문서 데이터를 가져와서 더 정확한 메타데이터 생성
  const apiDocData = await getCachedApiDoc(provider, slug);

  if (apiDocData) {
    return {
      title: `${apiDocData.title} - ${provider} API Documentation`,
      description: apiDocData.description,
      keywords: apiDocData.keywords?.join(', '),
      openGraph: {
        title: `${apiDocData.title} - ${provider} API`,
        description: apiDocData.description,
        type: 'website',
      },
    };
  }

  // 폴백 메타데이터
  return {
    title: `${provider} - ${slugPath} API Documentation`,
    description: `API documentation for ${provider} ${slugPath}`,
  };
}
