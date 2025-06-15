import { fetchApiDoc } from '@/entities/docs/api/fetchSchema';
import { ApiDoc } from '@/features/api-doc/ui/api-doc';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    provider: string;
    model: string;
  }>;
};

export default function Page(props: Props) {
  return <DocPage {...props} />;
}

async function DocPage({ params }: Props) {
  const { provider, model } = await params;
  const apiDocData = await fetchApiDoc(provider, model);

  if (!apiDocData) {
    notFound();
  }

  return <ApiDoc data={apiDocData} />;
}

export async function generateMetadata({ params }: Props) {
  const { provider, model } = await params;
  return {
    title: `${provider} - ${model} API Documentation`,
  };
}
