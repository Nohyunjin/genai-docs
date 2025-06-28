// slug 배열 기반으로 path 생성하는 헬퍼 함수
export function slugArrayToPath(slugArray: string[]): string {
  if (!slugArray || slugArray.length === 0) return '/';
  return '/' + slugArray.join('/');
}

// path에서 slug 배열 추출하는 헬퍼 함수
export function pathToSlugArray(path: string): string[] {
  if (!path || path === '/') return [];
  return path.split('/').filter((segment) => segment.length > 0);
}
