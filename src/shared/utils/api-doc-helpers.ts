// API 문서 관련 헬퍼 함수들

/**
 * 제공업체와 slug 배열로 API 문서 URL 생성
 */
export function generateApiDocUrl(provider: string, slug: string[]): string {
  const slugPath = slug.length > 0 ? slug.join('/') : '';
  return `/docs/${provider}${slugPath ? `/${slugPath}` : ''}`;
}

/**
 * path에서 slug 배열 추출
 */
export function pathToSlugArray(path: string): string[] {
  if (!path || path === '/') return [];
  return path.split('/').filter((segment) => segment.length > 0);
}

/**
 * slug 배열에서 path 생성
 */
export function slugArrayToPath(slugArray: string[]): string {
  if (!slugArray || slugArray.length === 0) return '/';
  return '/' + slugArray.join('/');
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
 * URL slug를 읽기 쉬운 제목으로 변환
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 제목을 URL slug로 변환
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .trim();
}

/**
 * API 문서 ID 생성 (provider + path 기반)
 */
export function generateApiDocId(provider: string, path: string): string {
  const sanitizedPath = path.replace(/[^a-zA-Z0-9\/\-\_]/g, '');
  return `${provider}_${sanitizedPath.replace(/\//g, '_')}`;
}
