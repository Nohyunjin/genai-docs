import { getCachedAllApiDocs } from '@/02.features/api-docs-fetching';
import { HomePage } from '@/04.pages/home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GenAI Docs - Explore Generative AI APIs',
  description:
    'Instantly find, understand, and use Generative AI APIs with ready-to-use code examples. Explore OpenAI, Google AI, Anthropic, and more.',
  keywords: [
    'AI API',
    'OpenAI',
    'GPT',
    'Gemini',
    'Claude',
    'API documentation',
    'generative AI',
  ],
  openGraph: {
    title: 'GenAI Docs - Explore Generative AI APIs',
    description:
      'Instantly find, understand, and use Generative AI APIs with ready-to-use code examples.',
    type: 'website',
  },
};

export default async function Home() {
  // 서버에서 초기 데이터 로드
  const initialApiDocs = await getCachedAllApiDocs();

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-100'>
      <div className='container mx-auto px-4 py-8'>
        <HomePage apiDocs={initialApiDocs} />
      </div>
    </div>
  );
}
