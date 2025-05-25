import { useEffect } from "react";
import { useParams } from "react-router";

export default function SocialStartPage() {
  const { provider } = useParams<{ provider: string }>();
  
  useEffect(() => {
    // 소셜 로그인 처리 로직
    // 예시: window.location.href = `/api/auth/${provider}`;
    
    // 임시로 로딩 메시지 표시
    console.log(`Starting ${provider} login...`);
  }, [provider]);

  const providerName = {
    google: 'Google',
    naver: 'Naver',
    kakao: 'Kakao',
  }[provider?.toLowerCase() || ''] || provider || '소셜';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {providerName} 로그인 중...
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {providerName} 계정으로 로그인을 진행 중입니다.
          <br />
          잠시만 기다려 주세요.
        </p>
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );
}
