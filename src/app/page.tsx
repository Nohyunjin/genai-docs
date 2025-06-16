'use client';

import { ApiDetailPage } from '@/features/api-doc/ui/api-detail-page';
import { ApiDocList } from '@/features/api-doc/ui/api-doc-list';
import { APIDocument } from '@/shared/types/api-doc';
import { useState } from 'react';

export default function Home() {
  const [selectedDoc, setSelectedDoc] = useState<APIDocument | null>(null);

  if (selectedDoc) {
    return (
      <div className='min-h-screen bg-neutral-950 text-neutral-100'>
        <div className='container mx-auto px-4 py-8'>
          <ApiDetailPage
            apiDoc={selectedDoc}
            onBack={() => setSelectedDoc(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-100'>
      <div className='container mx-auto px-4 py-8'>
        <ApiDocList onDocSelect={setSelectedDoc} />
      </div>
    </div>
  );
}
