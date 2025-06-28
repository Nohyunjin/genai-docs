import { APIDocument } from '@/00.shared/types/api-doc';
import { ApiDetailPage as ApiDetailWidget } from '@/03.widgets/api-doc-detail';

interface ApiDetailPageProps {
  apiDoc: APIDocument;
}

export const ApiDetailPage = ({ apiDoc }: ApiDetailPageProps) => {
  return <ApiDetailWidget apiDoc={apiDoc} />;
};
