import type { Route } from "./+types/join-page";
import { makeSSRClient } from "~/supa-client";
import { Form, Link, redirect } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string",
  }).email("Invalid email address"),
  password: z.string({
      required_error: "Password is required",
  }).min(8, { message: "Password must be at least 8 characters long" }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
      return {
          formError: error.flatten().fieldErrors,
      };
  }
  // const usernameExists = await checkUsernameExists(request, { username: data.username });
  // if (usernameExists) {
  //     return {
  //         formError: {
  //             username: ["Username already exists"],
  //         },
  //     };
  // }
  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      // options: {
      //     data: {
      //         name: data.name,
      //         username: data.username,
      //         role: data.role,
      //     },
      // },
  });
  if (signUpError) {
      console.error('SignUp Error:', {
          message: signUpError.message,
          name: signUpError.name,
          // status: signUpError.status,
          // details: signUpError.details,
          data: data  // 실제 전송된 데이터 확인
      });
      return {
          signUpError: `${signUpError.message} (${signUpError.name})`,
      };
  }
  return redirect("/room", { headers });
};

export default function JoinPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 text-center">고민 해결사로 함께해요</h2>
      <p className="mt-2 text-sm text-gray-600 text-center">
        혼자 고민하지 마세요. 해결사들이 기다리고 있어요
      </p>
      <Form className="mt-4 space-y-6" method="post">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="이메일 주소"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="비밀번호 (8자 이상)"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="sr-only">비밀번호 확인</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="비밀번호 확인"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
              이용약관
            </Link>과{' '}
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
              개인정보 처리방침
            </Link>에 동의합니다.
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            회원가입
          </button>
        </div>
      </Form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <a
              href="/auth/social/google/start"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Google로 회원가입</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </a>
          </div>
          <div>
            <a
              href="/auth/social/naver/start"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-green-500 text-white text-sm font-medium hover:bg-green-600"
            >
              <span className="sr-only">네이버로 회원가입</span>
              <span className="text-sm">N</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          이미 해결사이신가요?{' '}
          <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
