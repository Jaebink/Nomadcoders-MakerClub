import { useEffect } from "react";
import { useParams, Link } from "react-router";

export default function SocialCompletePage() {
  const { provider } = useParams<{ provider: string }>();
  
  useEffect(() => {
    // 소셜 로그인 콜백 처리 로직
    // 예시: URL 파라미터에서 토큰 추출 및 저장
    
    // 임시로 2초 후 메인 페이지로 리다이렉트
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [provider]);

  const providerName = {
    google: 'Google',
    naver: 'Naver',
    kakao: 'Kakao',
  }[provider?.toLowerCase() || ''] || provider || '소셜';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          로그인 성공!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {providerName} 계정으로 로그인되었습니다.
          <br />
          잠시 후 메인 페이지로 이동합니다.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            바로 이동하기
          </Link>
        </div>
      </div>
    </div>
  );
}
