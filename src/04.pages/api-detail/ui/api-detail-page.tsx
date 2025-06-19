import { APIDocument } from '@/00.shared/types/api-doc';
import { ApiDetailPage as ApiDetailWidget } from '@/03.widgets/api-doc-detail';
import React from 'react';

interface ApiDetailPageProps {
  apiDoc: APIDocument;
}

export const ApiDetailPage: React.FC<ApiDetailPageProps> = ({ apiDoc }) => {
  return <ApiDetailWidget apiDoc={apiDoc} />;
};
