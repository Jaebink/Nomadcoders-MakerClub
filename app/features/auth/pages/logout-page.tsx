import { useEffect } from "react";
import { redirect } from "react-router";

export default function LogoutPage() {
  useEffect(() => {
    // 로그아웃 로직 (예: 쿠키 삭제, 로컬 스토리지 클리어 등)
    // 임시로 메인 페이지로 리다이렉트
    window.location.href = "/";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          로그아웃 중입니다...
        </h2>
        <p className="text-gray-600">
          안전하게 로그아웃 처리 중입니다. 잠시만 기다려 주세요.
        </p>
      </div>
    </div>
  );
}

export function loader() {
  // 로그아웃 처리 후 리다이렉트
  return redirect("/");
}
