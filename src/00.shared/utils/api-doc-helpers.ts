// API 문서 관련 헬퍼 함수들

/**
 * 제공업체와 slug 배열로 API 문서 URL 생성
 */
export function generateApiDocUrl(provider: string, slug: string[]): string {
  const slugPath = slug.length > 0 ? slug.join('/') : '';
  return `/docs/${provider}${slugPath ? `/${slugPath}` : ''}`;
}

/**
 * 계층적 네비게이션을 위한 breadcrumb 생성
 */
export function generateBreadcrumbs(provider: string, slug: string[]) {
  const breadcrumbs = [
    { label: 'Docs', href: '/' },
    { label: provider, href: `/docs/${provider}` },
  ];

  // slug 배열로 중간 경로들 추가
  let currentPath = `/docs/${provider}`;
  for (let i = 0; i < slug.length; i++) {
    currentPath += `/${slug[i]}`;
    breadcrumbs.push({
      label: slug[i],
      href: currentPath,
    });
  }

  return breadcrumbs;
}

/**
 * API 타입별 기본 카테고리 매핑
 */
export const API_CATEGORY_MAPPINGS = {
  // LLM APIs
  llm: {
    openai: ['models', 'images', 'audio', 'fine-tuning'],
    google: ['models'],
    anthropic: ['models'],
    mistral: ['models'],
    cohere: ['models'],
  },
  // REST APIs
  rest: {
    notion: ['reference'],
    github: ['repos', 'users', 'issues', 'pulls'],
    stripe: ['charges', 'customers', 'subscriptions', 'products'],
    slack: ['channels', 'messages', 'users', 'files'],
  },
  // GraphQL APIs
  graphql: {
    github: ['queries', 'mutations', 'subscriptions'],
  },
} as const;

/**
 * 제공업체의 사용 가능한 카테고리 목록 반환
 */
export function getAvailableCategories(provider: string): string[] {
  const allCategories = Object.values(API_CATEGORY_MAPPINGS).flatMap(
    (typeCategories) =>
      typeCategories[provider as keyof typeof typeCategories] || []
  );

  return [...new Set(allCategories)];
}

/**
 * API 문서 ID 생성 (provider + path 기반)
 */
export function generateApiDocId(provider: string, path: string): string {
  const sanitizedPath = path.replace(/[^a-zA-Z0-9\/\-\_]/g, '');
  return `${provider}_${sanitizedPath.replace(/\//g, '_')}`;
}
