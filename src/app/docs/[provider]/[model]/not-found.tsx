import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-[70vh] flex items-center justify-center px-4'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          문서를 찾을 수 없습니다
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          요청하신 API 문서가 존재하지 않거나 아직 준비되지 않았습니다.
        </p>
        <Link
          href='/'
          className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
