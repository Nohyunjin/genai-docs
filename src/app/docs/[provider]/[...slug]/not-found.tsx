import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-[70vh] flex items-center justify-center px-4'>
      <div className='text-center max-w-md'>
        <h1 className='text-4xl font-bold text-neutral-100 mb-4'>
          API 문서를 찾을 수 없습니다
        </h1>
        <p className='text-lg text-neutral-400 mb-8'>
          요청하신 API 문서가 존재하지 않거나 아직 준비되지 않았습니다.
        </p>
        <div className='space-y-4'>
          <Link
            href='/'
            className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors duration-200'
          >
            홈으로 돌아가기
          </Link>
          <div className='text-sm text-neutral-500'>
            <p>또는 다음을 확인해보세요:</p>
            <ul className='mt-2 space-y-1'>
              <li>• URL이 정확한지 확인</li>
              <li>• 제공업체명이 올바른지 확인</li>
              <li>• API 경로가 유효한지 확인</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
