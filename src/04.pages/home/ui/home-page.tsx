import { APIDocument } from '@/00.shared/types/api-doc';
import { ApiDocList } from '@/03.widgets/api-doc-list';
import React from 'react';

interface HomePageProps {
  apiDocs: APIDocument[];
}

export const HomePage: React.FC<HomePageProps> = ({ apiDocs }) => {
  return <ApiDocList initialApiDocs={apiDocs} />;
};
