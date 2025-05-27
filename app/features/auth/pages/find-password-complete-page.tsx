import { Form, Link, useNavigation } from "react-router";

export default function OtpCompletePage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 text-center">비밀번호 재설정</h2>
      <p className="mt-2 text-sm text-gray-600 text-center">
        새로운 비밀번호를 입력해주세요.
      </p>
      
      <Form className="mt-8 space-y-6" method="post">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="otp" className="sr-only">인증코드</label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="인증코드 6자리"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="sr-only">새 비밀번호</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="새 비밀번호 (8자 이상)"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="비밀번호 확인"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isSubmitting
                ? 'bg-indigo-400'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isSubmitting ? '처리 중...' : '비밀번호 재설정'}
          </button>
        </div>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            로그인 화면으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
