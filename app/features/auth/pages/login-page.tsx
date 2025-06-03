import type { Route } from "./+types/login-page";
import InputPair from "~/common/components/input-pair";
import { Form, Link, redirect } from "react-router";
import { LoadingButton } from "~/common/components/loading-button";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";

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
      loginError: null,
      formError: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      return {
        loginError: loginError.message,
        formError: null,
      };
    }
  return redirect("/room", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 text-center">로그인</h2>
      <Form className="w-full space-y-4" method="post">
        <InputPair
            id="email"
            label="Email"
            description="Enter your email address"
            name="email"
            required
            type="email"
            placeholder="i.e wemake@example.com"
        />
        {actionData && "formError" in actionData && (
            <p className="text-sm text-red-500">{actionData.formError?.email?.join(", ")}</p>
        )}
        <InputPair
            id="password"
            label="Password"
            description="Enter your password"
            name="password"
            required
            type="password"
            placeholder="Enter your password"
        />
        {actionData && "formError" in actionData && (
            <p className="text-sm text-red-500">{actionData.formError?.password?.join(", ")}</p>
        )}                    
        <LoadingButton text="Login" />
        {actionData && "loginError" in actionData && (
            <p className="text-sm text-red-500">{actionData.loginError}</p>
        )}                    
    </Form>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            로그인 상태 유지
          </label>
        </div>

        <div className="text-sm">
          <Link to="/auth/find-password/start" className="font-medium text-indigo-600 hover:text-indigo-500">
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>      
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
              <span className="sr-only">Google로 로그인</span>
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
              <span className="sr-only">네이버로 로그인</span>
              <span className="text-sm">N</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          아직 회원이 아니신가요?{' '}
          <Link to="/auth/join" className="font-medium text-indigo-600 hover:text-indigo-500">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
